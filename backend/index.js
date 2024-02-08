require('dotenv').config();
const db = require('./db.js')

const DATABASEURL = process.env.DATABASEURL;

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
//const AWS = require('aws-sdk');


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");


const app = express();
//app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json()); // for parsing application/json

const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your front-end's address
  credentials: true,  // This allows the server to accept cookies
};

app.use(cors(corsOptions));
const storage = multer.memoryStorage();
const uploader = multer({storage});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    jwt.verify(req.token, 'YourSecretKey', (err, authData) => {
      if (err) {
        res.sendStatus(403); // Forbidden
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};



const s3Client = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});


const uploadFileToS3 = async (file) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Date.now().toString() + "-" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
    },
  });

  try {
    const result = await upload.done();
    return result.Key;
  } catch (err) {
    throw new Error("File upload failed: " + err.message);
  }
};





// Protected Route
app.get('/yourProtectedRoute', verifyToken, (req, res) => {
  // If token is verified, process the request
  res.json({ message: 'Access to protected data', user: req.authData });
});


//fetching all comment of a post
app.post('/fetchComment', (req,res) => {
  const {postId,currentUserId} = req.body;
  //console.log(postId,currentUserId);
  try {
    query = `Select users.username , comments.commentText , profile_pictures.pictureURL from comments join users on users.Id=comments.userId left join profile_pictures on profile_pictures.userId=users.id where comments.postId=?;`
    db.query(query,[postId], (err,result) => {
      if (err) {
        console.error('Error retrieving comments: ', err.message)
        res.status(500).send('Error retrieving comments from db')
      } else {
        //console.log(result);
        res.json(result)
      }
    })
  } catch (err) {
    console.error('Error retrieving comments: ', err.message)
    res.status(500).send('Error retrieving comments from db')
  }

})

//submit comment to database 
app.post('/submitComment', (req,res) => {
  const {postId,currentUserId,comment} = req.body;
  //console.log(postId , currentUserId,comment);
  query = `Insert into comments(postId,userId,commentText) values(?,?,?)`
  try {
    db.query(query,[postId,currentUserId,comment], (err,result) => {
      if (err) {
        console.error('Error inserting comment into db: ', err.message)
        res.status(500).send('Error inserting comment into db')
      } else {
        res.status(200).send('Successfully inserted comment into db')
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error inserting post into db')
  }
  
})

//retrieve all post data from db
app.get('/allPost', (req,res)=> {
  try {
    query = 
    `select users.id , users.username , posts.postId , posts.imageURL , posts.caption, 
    (select count(*) from likes where likes.postId = posts.postId) as 'likeCount',
    (select count(*) from comments where comments.postId = posts.postId) as 'commentCount'
    from users join posts on users.id = posts.userId`
    db.query(query,(err,result) => {
      if (err) {
        console.error('Error retrieving post from db:', err.message)
        res.status(500).send('Error retrieving post')
      } else {
        res.json(result);
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving post data')
  }
})

//check if post is currently like/unlike
app.post('/checkLike', (req,res) => {
  const { postId,currentUserId } = req.body;
  //console.log(postId, currentUserId);
  try {
    query = `select * from likes where likes.postId=? and likes.userId=?`;
    db.query(query,[postId,currentUserId], (err,result) => {
      if (err) {
        console.error('Error checking if current user has liked the post: ', err.message)
      } else {
        if (result.length > 0) {
          res.json({
            liked: true,
            message: 'user has liked the post'
          })
        } else {
          res.json({
            liked: false,
            message: 'user has not liked the post'
          })
        }
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error checking like/unlike')
  }
})

//enable like or dislike 
app.post('/likeUnlike', (req,res) => {
  //console.log(req.body);
  const {postId , currentUserId} = req.body;
  //checking if the user has like the post b4
  query = `select * from likes where likes.postId=? and likes.userId=?`
  db.query(query,[postId,currentUserId], (err,result)=> {
    if (err) {
      console.error('Error checking if current user has liked the post:' + err.message)
      res.status(500).send('Error checking like/unlike')
    } else {
      if (result.length > 0) {
        //current user has liked the post b4
        //users wishes to unlike the post
        query = `delete from likes where likes.postId=? and likes.userId=?`
        db.query(query,[postId,currentUserId],(err,result)=> {
          if (err) {
            console.error('Error unliking post:' + err.message)
            res.status(500).send('Error unliking post')
          } else {
            res.json({
              liked: false,
              message: 'User has unliked the post'
            })
          }
        })
      } else {
        //user has not liked this post b4
        //user wishes to like this post
        query = `insert into likes(postId,userId) values(?,?)`
        db.query(query,[postId,currentUserId],(err,result) => {
          if (err) {
            console.error('Error liking post:' + err.message)
            res.status(500).send('Error liking post')
          } else {
            res.json({
              liked: true,
              message: 'User has liked this post'
            })
          }
        })
      }
    }
  })
})


//upload user photo and caption
app.post('/createPost',uploader.single('file') , async (req, res) => {
  try {
    const partialImageURL = await uploadFileToS3(req.file)
    const { caption , userId } = req.body 
    const imageURL = `https://instagramclone12345.s3.ap-southeast-2.amazonaws.com/${partialImageURL}`
    //console.log(caption , userId);
    //console.log(imageURL);

    query = `Insert into posts(userId,imageURL,caption) VALUES (?,?,?)`
    db.query(query,[userId,imageURL,caption], (err,results)=> {
      if (err) {
        console.error('Error inserting Post into db:' + err.message)
        res.status(500).send('Error creating post')
      } else {
        //console.log('Successfully inserted post into db');
        res.status(200).send('Successflly created post')
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating post')
  }
});


//submit profile picture of user 
app.post('/submitPfp', uploader.single('file'), async (req, res) => {
  try {
    const partialImageURL = await uploadFileToS3(req.file);
    const { userId } = req.body;
    const imageURL = `https://instagramclone12345.s3.ap-southeast-2.amazonaws.com/${partialImageURL}`;

    await upsertProfilePicture(userId, imageURL);
    sendResponse(res, 200, 'Successfully uploaded profile picture');
  } catch (err) {
    console.error('Error in /submitPfp: ', err.message);
    sendResponse(res, 500, 'Error uploading profile picture');
  }
});

function upsertProfilePicture(userId, imageURL) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO profile_pictures (userId, pictureURL)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE pictureURL = VALUES(pictureURL)`;

    db.query(query, [userId, imageURL], (err, result) => {
      if (err) {
        console.error('Error in upsertProfilePicture: ', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

function sendResponse(res, statusCode, message) {
  res.status(statusCode).send(message);
}

//fetch profile picture of a user
app.get('/getProfilePicture', (req,res) => {
  const {id} = req.query;
  //console.log(id);
  try {
    query = `select pictureURL from profile_pictures where userId=? `
    db.query(query,[id],(err, result) => {
      if (err) {
        res.status(500).send('Error in retrieving profile Picture')
      } else {
        //console.log(result);
        if (result.length > 0) {
          res.json(result)
        } else {
          res.json({message: 'no profile picture found'})
        }
      }
    })
  } catch (err) {
    console.error('Error retrieving pfp: ', err)
    res.status(500).send('Error in server');
  }
  
})

//get Suggested user
app.get('/getSuggestedUser', (req,res) => {
  const {id} = req.query;
  try {
    query = `select users.username , profile_pictures.pictureURL from users left join profile_pictures on users.id = profile_pictures.userId where users.id!=?;
    `
    db.query(query,[id], (err,results) => {
      if (err) {
        res.status(500).send('Error in retrieving suggested users')
      } else {
        res.json(results)
      }
    })
  } catch (err) {
    console.error('Error retrieving suggested user: ', err)
    res.status(500).send('Error in retrieving suggested users')
  }
})

//post user data to the database
app.post('/register' , async (req,res) => {
  try {
    const {mobileOrEmail , fullName , username , password} = req.body;
    const hashedPassword = await bcrypt.hash(password , 10);

    //Insert into db
    query = `Insert into users(mobileOrEmail,fullName,username,password) VALUES(?,?,?,?)`;
    db.query(query,[mobileOrEmail,fullName,username,hashedPassword], (err,result) => {
      if (err) throw err;
      res.status(201).send('User registered Successfully')
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering User')
  }
})  




//get user data from database
app.post('/' , (req,res) => {
  const {username,password} = req.body;
  const query = `select * from users where username=?`;
  db.query(query,[username], async (err,results) => {
    if (err) {
      return res.status(500).send('Server error')
    }

    if (results.length === 0) {
      return res.status(401).send('incorrect credentials')
    }

    //console.log(results)
    const user = results[0]
    //console.log(user);
    const isValid = await bcrypt.compare(password,user.password);

    if (isValid) {
      //console.log('login successful');
      const token = jwt.sign({
        id: user.id,
        username: user.username
      }, 'YourSecretKey')
      res.json({ token });
      //console.log('token: ' , token);  
    } else {
      res.status(401).send('incorrect credentials')
    }

  })
 
})

//fetch all post from db for a user 
app.get('/getAllPost', (req,res) => {
  const {id} = req.query;
  try {
    query = `select imageURL from posts where userId=?`;
    db.query(query,[id],(err,result) => {
      if (err) {
        console.error('Error retrieving all post from user')
        res.status(500).send('Error retrieving all post from user')
      } else {
        if (result.length > 0) {
          //console.log(result)
          res.json(result)
        } else {
          res.json({message: 'no post found'})
        }
      }
    })
  } catch (error) {
    console.error('Error retrieving all post from user')
    res.status(500).send('Error retrieving all post from user')
  }
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;