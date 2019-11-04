CREATE TABLE users
(
    user_id varchar(250) NOT NULL PRIMARY KEY,
    mail varchar(250) NOT NULL,
    user_name varchar(250) NOT NULL,
    last_name varchar(250) NOT NULL,
    first_name varchar(250) NOT NULL,
    birthday varchar(250) NOT NULL,
    password_hash varchar(250) NOT NULL,
    gender varchar(250),
    orientation varchar(250),
    presentation text,
    score integer,
    city varchar(250),
    latitude varchar(250),
    longitude varchar(250),
    last_connection varchar(250),
    validated_account boolean NOT NULL,
    unique_link_id varchar(250),
    token varchar(250)
);

CREATE TABLE tag
(
    tag_id varchar(250) NOT NULL PRIMARY KEY,
    name varchar(250) NOT NULL,
    custom boolean NOT NULL
);

CREATE TABLE user_tag
(
    tag_id varchar(250) NOT NULL,
    user_id varchar(250) NOT NULL
);

CREATE TABLE user_like
(
    liking_user_id varchar(250) NOT NULL,
    liked_user_id varchar(250) NOT NULL,
    date varchar(250) NOT NULL
);

CREATE TABLE user_visit
(
    visiting_user_id varchar(250) NOT NULL,
    visited_user_id varchar(250) NOT NULL,
    date varchar(250) NOT NULL
);

CREATE TABLE profile_picture
(
    user_id varchar(250) NOT NULL,
    path varchar(250) NOT NULL,
    date varchar(250) NOT NULL,
    main bool NOT NULL
);

CREATE TABLE user_block
(
    blocking_user_id varchar(250) NOT NULL,
    blocked_user_id varchar(250) NOT NULL
);

CREATE TABLE user_report
(
    reporting_user_id varchar(250) NOT NULL,
    reported_user_id varchar(250) NOT NULL
);

CREATE TABLE chat
(
    sender_id varchar(250) NOT NULL,
    receiver_id varchar(250) NOT NULL,
    date varchar(250) NOT NULL,
    message text NOT NULL,
    message_id varchar(250) NOT NULL,
    sender_read boolean NOT NULL,
    receiver_read boolean NOT NULL
);

CREATE TABLE notification
(
    receiver_id varchar(250) NOT NULL,
    sender_id varchar(250) NOT NULL,
    date varchar(250) NOT NULL,
    notif_type varchar(250) NOT NULL,
    seen boolean NOT NULL
);

INSERT INTO tag (tag_id, name, custom)
VALUES  ('0', 'Make-up', false),
('1', 'Pet', false),
('2', 'Fair', false),
('3', 'Art ', false),
('4', 'Politics', false),
('5', 'Brown-hair', false),
('6', 'Red-hair', false),
('7', 'Computer Science', false),
('8', 'Tamagotchi', false),
('9', 'Movies', false),
('10', 'Sport', false),
('11', 'Music', false),
('12', 'Friends', false),
('13', 'Bar', false),
('14', 'Party', false),
('15', 'Books', false),
('16', 'Mangas', false),
('17', 'Social media', false),
('18', 'Youtube', false),
('19', 'Video games', false),
('20', 'Car', false),
('21', 'Vegan', false),
('22', 'Yoga', false),
('23', 'Jewellery', false)
