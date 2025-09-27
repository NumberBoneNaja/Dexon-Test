package config

import (
	"dexon_test/entity"
	"fmt"
	"log"
	"time"

	// "time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "localhost"  // or the Docker service name if running in another container
	port     = 5432         // default PostgreSQL port
	user     = "myuser"     // as defined in docker-compose.yml
	password = "mypassword" // as defined in docker-compose.yml
	dbname   = "mydatabase" // as defined in docker-compose.yml
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}
func ConnectionDB() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Open a connection
	var err error
	db, err = gorm.Open(postgres.Open(psqlInfo), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	fmt.Println("Successfully connected!")

}

func SetupDatabase() {
	db.AutoMigrate(&entity.Info{}, 
		&entity.CML{}, 
		&entity.TestPoint{},
		 &entity.Thickness{})
	fmt.Println("Database Migrated")
	SeedInfo(db)
	SeedCML(db)
	SeedTestPoint(db)
}


func SeedInfo(db *gorm.DB) {
	mockInfos := []entity.Info{
		{
			LineNumber:          "6-PL-J4N-01007",
			Location:            "Dacon A",
			From:                "BLACK STARTCOOLED WELL FLUID FROM MDPP",
			To:                  "TEST SEPARATOR,V-0111",
			DrawingNumber:       "MDA-D-B-26001-1-0-Rev00-2011",
			Service:             "PL",
			Material:            "Duplex Stainless Steel",
			InserviceDate:      time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
			PipeSize:            6,
			OriginalThickness:   7,
			Stress:              20000,
			JointEfficiency:     1,
			Ca:                  3,
			DesignLife:          25,
			DesignPressure:      1015,
			OperatingPressure:   327,
			DesignTemperature:   140,
			OperatingTemperature: 45,
		},
		{
			LineNumber:          "6-PL-J4N-01110",
			Location:            "Dacon B",
			From:                "BLACK STARTCOOLED WELL FLUID FROM MDPP",
			To:                  "TEST SEPARATOR,V-0111",
			DrawingNumber:       "MDA-D-B-26001-1-0-Rev00-2011",
			Service:             "PL",
			Material:            "Duplex Stainless Steel",
			InserviceDate:       time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
			PipeSize:            6,
			OriginalThickness:   7,
			Stress:              20000,
			JointEfficiency:     1,
			Ca:                  3,
			DesignLife:          25,
			DesignPressure:      1015,
			OperatingPressure:   327,
			DesignTemperature:   140,
			OperatingTemperature: 45,
		},
		// สามารถเพิ่ม record ที่เหลือได้เหมือนกัน
	}

	for _, info := range mockInfos {
		db.
			Where(entity.Info{LineNumber: info.LineNumber}).
			FirstOrCreate(&info)
	}
	
}


func SeedCML(db *gorm.DB) {
	mockCMLs := []entity.CML{
		{
			CMLNumber:            1,
			CMLDescription:        "Pipe",
			ActualOutsideDiameter: 0,
			DesignThickness:       0,
			StructuralThickness:   0,
			RequiredThickness:     0,
			InfoID:                1,
		},
		{
			CMLNumber:      2,
			CMLDescription: "Elbow i",
			InfoID:     1,
		},
		{
			CMLNumber:      3,
			CMLDescription: "Elbow ii",
			InfoID:     1,
		},
		{
			CMLNumber:      4,
			CMLDescription: "Pipe",
			InfoID:     1,
		},
		{
			CMLNumber:      5,
			CMLDescription: "Pipe",
			InfoID:     1,
		},
		{
			CMLNumber:      1,
			CMLDescription: "Pipe",
			InfoID:     2,
		},
		{
			CMLNumber:      2,
			CMLDescription: "Tee i",
			InfoID:   2,
		},
		{
			CMLNumber:      3,
			CMLDescription: "Tee iii",
			InfoID:     2,
		},
		{
			CMLNumber:      4,
			CMLDescription: "Pipe",
			InfoID:     2,
		},
	}

	for _, cml := range mockCMLs {
		db.
			Where(entity.CML{CMLNumber: cml.CMLNumber}).
			FirstOrCreate(&cml)
	}
}

func SeedTestPoint(db *gorm.DB) {
	mockTestPoints := []entity.TestPoint{
		// 6-PL-J4N-01007, CmlNumber 1
		{TPNumber : 1, TPDescription: "0", CMLID: 1},
		{TPNumber: 2, TPDescription: "90", CMLID: 1},
		{TPNumber: 3, TPDescription: "180", CMLID: 1},
		{TPNumber: 4, TPDescription: "270", CMLID: 1},

		// 6-PL-J4N-01007, CmlNumber 2
		{TPNumber: 1, TPDescription: "0", CMLID: 2},
		{TPNumber: 2, TPDescription: "90", CMLID: 2},
		{TPNumber: 3, TPDescription: "180", CMLID: 2},
		{TPNumber: 4, TPDescription: "270", CMLID: 2},

		// 6-PL-J4N-01007, CmlNumber 3
		{TPNumber: 1, TPDescription: "0", CMLID: 3},
		{TPNumber: 2, TPDescription: "90", CMLID: 3},
		{TPNumber: 3, TPDescription: "180", CMLID: 3},
		{TPNumber: 4, TPDescription: "270", CMLID: 3},

		// 6-PL-J4N-01007, CmlNumber 4
		{TPNumber: 1, TPDescription: "0", CMLID: 4},
		{TPNumber: 2, TPDescription: "90", CMLID: 4},
		{TPNumber: 3, TPDescription: "180", CMLID: 4},
		{TPNumber: 4, TPDescription: "270", CMLID: 4},

		// 6-PL-J4N-01007, CmlNumber 5
		{TPNumber: 1, TPDescription: "0", CMLID: 5},
		{TPNumber: 2, TPDescription: "90", CMLID: 5},
		{TPNumber: 3, TPDescription: "180", CMLID: 5},
		{TPNumber: 4, TPDescription: "270", CMLID: 5},

		// 6-PL-J4N-01110, CmlNumber 1
		{TPNumber: 1, TPDescription: "0", CMLID: 1},
		{TPNumber: 2, TPDescription: "90", CMLID: 1},
		{TPNumber: 3, TPDescription: "180", CMLID: 1},
		{TPNumber: 4, TPDescription: "270", CMLID: 1},

		// 6-PL-J4N-01110, CmlNumber 2
		{TPNumber: 1, TPDescription: "0", CMLID: 2},
		{TPNumber: 2, TPDescription: "90", CMLID: 2},
		{TPNumber: 3, TPDescription: "180", CMLID: 2},
		{TPNumber: 4, TPDescription: "270", CMLID: 2},

		// 6-PL-J4N-01110, CmlNumber 3
		{TPNumber: 1, TPDescription: "0", CMLID: 3},
		{TPNumber: 2, TPDescription: "90", CMLID: 3},
		{TPNumber: 3, TPDescription: "180", CMLID: 3},
		{TPNumber: 4, TPDescription: "270", CMLID: 3},

		// 6-PL-J4N-01110, CmlNumber 4
		{TPNumber: 1, TPDescription: "0", CMLID: 4},
		{TPNumber: 2, TPDescription: "90", CMLID: 4},
		{TPNumber: 3, TPDescription: "180", CMLID: 4},
		{TPNumber: 4, TPDescription: "270", CMLID: 4},
	}

	for _, TestPoint := range mockTestPoints {
		db.
			Where(entity.TestPoint{TPNumber : TestPoint.TPNumber}).
			FirstOrCreate(&TestPoint)
	}
}