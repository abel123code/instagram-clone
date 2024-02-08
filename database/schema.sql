CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobileOrEmail VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    imageURL VARCHAR(255) NOT NULL,
    caption TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE comments (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    postId INT NOT NULL,
    userId INT NOT NULL,
    commentText TEXT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(postId),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE likes (
    likeId INT AUTO_INCREMENT PRIMARY KEY,
    postId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(postId),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE profile_pictures (
    profilePicId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    pictureURL VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);