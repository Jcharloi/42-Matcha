DROP schema public cascade;
CREATE schema public;

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
    situation varchar(250) NULL,
    presentation text,
    score varchar(250),
    city varchar(250),
    last_connection varchar(250),
    validated_account boolean NOT NULL,
    unique_link_id varchar(250)
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

CREATE TABLE profile_picture
(
    user_id varchar(250) NOT NULL,
    path varchar(250) NOT NULL,
    date varchar(250) NOT NULL,
    main bool NOT NULL
);

CREATE TABLE blocked
(
    blocker_id varchar(250) NOT NULL,
    blocked_user_id varchar(250) NOT NULL
);

CREATE TABLE reported
(
    reporter_id varchar(250) NOT NULL,
    reported_user_id varchar(250) NOT NULL
);

CREATE TABLE chat
(
    sender_id varchar(250) NOT NULL,
    receiver_id varchar(250) NOT NULL,
    date date NOT NULL,
    message varchar(250) NOT NULL
);

CREATE TABLE notification
(
    receiver_id varchar(250) NOT NULL,
    sender_id varchar(250) NOT NULL,
    date date NOT NULL,
    notif_type varchar(250) NOT NULL
)

/*
 select users.username, tags.name from users join user_tags on (user_tags.id_user = users.id) <- chopper toutes les infos dans user_tags a partir du moment ou id_user = users.id
 join tags on (user_tags.id_tag = tags.id) <- choper toutes les infos dans la table tags a partir du moment ou le tags.id  = users_tags.id_tag
 where tags.id = 2;
*/