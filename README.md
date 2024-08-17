MyChronicles HomePage

<video width="600" controls>
  <source src="./my_chronicles_homepage.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

How to run MyChronicles Locally:

IF YOU HAVE A COPY OF THE DB WITH DATA, restore it and give asp.net the connection string instead

To restore local database to DB in cloud:

Create a copy of local database:
pg_dump -U postgres -F c -b -v -f dump_file_name.dump db_name;

Restore it on the cloud DB:
pg_restore -d  connection_string_url --no-owner ./path_to_dump_file/dump_file_name.dump


To start up asp.net server:
Need to connect to db
Create an empty PostgreSQL db, get the connection string
Login 
Type in command “CREATE DATABASE your_database_name;”
Ex: db name: test_chronicles_db
Go to directory api/myChroniclesApi
Create file called appsettings.json inside the api/myChroniclesApi directory 

The file should have this format:


{
    "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Port=5432;Database=db_name;Username=postgres;Password=userPasswordHere"
    }
}

Type “dotnet ef database update  –context MyChroniclesDbContext”  // this way all db tables will be created, not required if restoring from dump/sql file
Type “dotnet run”		       //  runs the db


To deploy NextJS app:
Go to frontend directory/folder
Run commands
npm install 	// installs all dependencies
npm run build  // generates an optimized production build
npm start         // starts the project 

Deploying ASP.net on cloud, need a way to connect to database and to set up db tables




