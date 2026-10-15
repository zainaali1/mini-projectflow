create table People(
PersonID INT IDENTITY(1,1) PRIMARY KEY,
FirstName NVARCHAR(100) NOT NULL,
LastName NVARCHAR(100) NOT NULL,
Email NVARCHAR(255) NOT NULL UNIQUE,
JobRole NVARCHAR(100) NOT NULL,
IsActive BIT NOT NULL DEFAULT 1
);


insert into People (FirstName, LastName, Email, JobRole )
values (N'Zara', N'Syed', N'zaras123@gmail.com','Doctor');

insert into People (FirstName, LastName, Email, JobRole )
values (N'Kendall', N'Oliver', N'kendall621@gmail.com','Data Scientist');

insert into People (FirstName, LastName, Email, JobRole )
values (N'Barbara', N'Williams', N'bwilliams@gmail.com','Lawyer');

insert into People (FirstName, LastName, Email, JobRole, IsActive )
values (N'Bethany', N'Williams', N'bwilliams@gmail.com','Teacher', 0);

select FirstName, LastName, Email from People Where IsActive = 1 order by LastName ASC;