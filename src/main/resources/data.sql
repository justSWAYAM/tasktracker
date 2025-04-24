-- Sample users
INSERT INTO users (username, password, email, created_at, updated_at) VALUES
('admin', '$2a$10$X7v3Y5J8Q9R2T1U4I6O7P8Q9R2T1U4I6O7P8Q9R2T1U4I6O7P8', 'admin@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user1', '$2a$10$X7v3Y5J8Q9R2T1U4I6O7P8Q9R2T1U4I6O7P8Q9R2T1U4I6O7P8', 'user1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample countries
INSERT INTO countries (name, code, population) VALUES
('United States', 'USA', 331002651),
('China', 'CHN', 1439323776),
('Japan', 'JPN', 126476461),
('Germany', 'DEU', 83783942),
('United Kingdom', 'GBR', 67886011),
('France', 'FRA', 65273511),
('Brazil', 'BRA', 212559417),
('India', 'IND', 1380004385),
('Russia', 'RUS', 145912025),
('Australia', 'AUS', 25499884);

-- Insert sample sports
INSERT INTO sports (name, description, category) VALUES
('Swimming', 'Competitive swimming in various strokes and distances', 'Aquatic'),
('Athletics', 'Track and field events including running, jumping, and throwing', 'Track & Field'),
('Gymnastics', 'Artistic and rhythmic gymnastics competitions', 'Gymnastics'),
('Basketball', 'Team sport played between two teams of five players', 'Team Sports'),
('Football', 'Team sport played between two teams of eleven players', 'Team Sports'),
('Tennis', 'Racket sport played individually or between teams of two', 'Racket Sports'),
('Boxing', 'Combat sport involving two opponents fighting with fists', 'Combat Sports'),
('Weightlifting', 'Strength sport involving lifting heavy weights', 'Strength Sports'),
('Cycling', 'Sport involving riding bicycles in various disciplines', 'Cycling'),
('Volleyball', 'Team sport played between two teams of six players', 'Team Sports');

-- Insert sample athletes
INSERT INTO athletes (name, country_id, sport_id, age, gender, personal_best) VALUES
('Michael Phelps', 1, 1, 38, 'M', '23 Olympic Gold Medals'),
('Usain Bolt', 5, 2, 37, 'M', '9.58s 100m World Record'),
('Simone Biles', 1, 3, 26, 'F', '32 Olympic and World Championship medals'),
('LeBron James', 1, 4, 39, 'M', '4x NBA Champion'),
('Lionel Messi', 7, 5, 36, 'M', '7x Ballon dOr Winner'),
('Serena Williams', 1, 6, 42, 'F', '23 Grand Slam Singles Titles'),
('Muhammad Ali', 1, 7, 74, 'M', '3x World Heavyweight Champion'),
('Lasha Talakhadze', 9, 8, 30, 'M', '488kg Total World Record'),
('Chris Froome', 5, 9, 38, 'M', '4x Tour de France Winner'),
('Zhu Ting', 2, 10, 29, 'F', '2x World Cup MVP'); 