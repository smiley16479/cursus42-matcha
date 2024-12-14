#! /usr/bin/python

from datetime import datetime, timedelta
from pathlib import Path
from faker import Faker
from enum import Enum
from tqdm import tqdm
import requests
import random
import lorem
import names
import time
import json
import sys


API_URL = "http://localhost:3000/api/"

PICTURES_FOLDER = "./test_pictures/"
MALE_PICTURES_FOLDER = PICTURES_FOLDER + "Male/"
FEMALE_PICTURES_FOLDER = PICTURES_FOLDER + "Female/"
PICTURES_PROFIL_FOLDER = './front/static/profil/'

DEFAULT_EMAIL = "francoisdescamps40@gmail.com"

class EGender(Enum):
    Female = "Female"
    Male = "Male"
    Unknown = "Unknown"

class ESexualPref(Enum):
    Female = "Female"
    Male = "Male"
    Both = "Both"

class EInterest(Enum):
    Books = "Books"
    Blogging = "Blogging"
    Dancing = "Dancing"
    Singing = "Singing"
    Music = "Music"
    Languages = "Languages"
    Shopping = "Shopping"
    Traveling = "Traveling"
    Hiking = "Hiking"
    Cycling = "Cycling"
    Exercising = "Exercising"
    Drawing = "Drawing"
    Painting = "Painting"
    Collection = "Collection"
    VideoGames = "VideoGames"
    Cooking = "Cooking"
    Baking = "Baking"
    Gardening = "Gardening"
    Embroidering = "Embroidering"
    Sewing = "Sewing"
    Knitting = "Knitting"
    BoardGames = "BoardGames"
    Walking = "Walking"
    Writing = "Writing"
    Fishing = "Fishing"
    Photography = "Photography"
    Skydiving = "Skydiving"
    Skating = "Skating"
    Skiing = "Skiing"
    Longboarding = "Longboarding"
    Surfing = "Surfing"

# Init libs
session = requests.Session()
fake = Faker()
Faker.seed(0)

nbFemaleProfiles = 0
nbMaleProfiles = 0
if (len(sys.argv) > 1):
    nbProfiles = int(sys.argv[1])
else:
    nbProfiles = 500

#####################################
######## GPT test profiles ########
#####################################

for userNb in tqdm (range(16), desc="Populating database with GPT profiles...   "):
    if userNb % 2:
        gender = EGender.Male.value
    else:
        gender = EGender.Female.value
    with open(PICTURES_PROFIL_FOLDER + str(userNb) + "/bio.json", 'r', encoding='utf-8') as file:
        data = json.load(file)
    firstName = data["nom"]
    lastName = names.get_last_name()
    userName = firstName + lastName[:1]
    password = "tesT123!!!"
    age = data["age"]
    fameRate = 100
    sexualPref = random.choice(list(ESexualPref)).value
    biography = data["description"]
    [latitude, longitude, *_] = fake.local_latlng(country_code='FR')
    lastConnection = str(datetime.now() - timedelta(days=random.uniform(0, 365)))
    interests = random.sample(list(map(lambda c: c.value, EInterest)), random.randint(0, 20))

    # Create Debug User
    debug_user_json = {
        "email": DEFAULT_EMAIL,
        "firstName": firstName,
        "lastName": lastName,
        "userName": userName,
        "password": password,
        "age": age,
        "fameRate": fameRate,
        "gender": gender,
        "sexualPref": sexualPref,
        "biography": biography,
        "latitude": latitude,
        "longitude": longitude,
        "lastConnection": lastConnection,
        "interests": interests
    }

    response = session.post(API_URL + "user/debugCreateUser", json=debug_user_json)
    if response.status_code != 200:
        print(response)

    # Upload pictures
    files = []
    for index in range(data["photo"]):
        picture_path = PICTURES_PROFIL_FOLDER + str(userNb) + "/" + str(index + 1) + ".webp"
        picture = open(picture_path, 'rb').read()
        files.append(('picture', (picture_path.split("/")[-1], picture, "image/webp")))

    debug_user_json.update({"isSamePic": "false"})
    response = session.post(API_URL + "user/debugUpload", data=debug_user_json, files=files)
    if response.status_code != 200:
        print(response)


#####################################
######## Basic test profiles ########
#####################################


print()

for userNb in tqdm (range(nbProfiles), desc="Populating database with other profiles... "):

    # Define user properties
    gender = random.choice(list(EGender)).value
    if gender == "Unknown":
        actual_gender = random.choice([EGender.Male, EGender.Female]).value
    else:
        actual_gender = gender

    if (actual_gender == "Female"):
        nbFemaleProfiles += 1
    else:
        nbMaleProfiles += 1
    
    firstName = names.get_first_name(gender=actual_gender.lower())
    lastName = names.get_last_name()
    userName = firstName + lastName[:1] + str(random.randint(1000, 2000))
    password = "tesT123!!!"
    age = random.randint(18, 40)
    fameRate = random.randint(0, 100)
    sexualPref = random.choice(list(ESexualPref)).value
    biography = lorem.paragraph()
    [latitude, longitude, *_] = fake.local_latlng(country_code='FR')
    lastConnection = str(datetime.now() - timedelta(days=random.uniform(0, 365)))
    interests = random.sample(list(map(lambda c: c.value, EInterest)), random.randint(0, 20))

    if actual_gender == "Female":
        picture_path = FEMALE_PICTURES_FOLDER + str(nbFemaleProfiles) + "_f.webp"
    else:
        picture_path = MALE_PICTURES_FOLDER + str(nbMaleProfiles) + "_m.webp"
    picture = open(picture_path, 'rb').read()

    files = [('picture', (picture_path.split("/")[-1], picture, "image/webp"))]
    

    # Create Debug User
    debug_user_json = {
        "email": DEFAULT_EMAIL,
        "firstName": firstName,
        "lastName": lastName,
        "userName": userName,
        "password": password,
        "age": age,
        "fameRate": fameRate,
        "gender": gender,
        "sexualPref": sexualPref,
        "biography": biography,
        "latitude": latitude,
        "longitude": longitude,
        "lastConnection": lastConnection,
        "interests": interests
    }

    response = session.post(API_URL + "user/debugCreateUser", json=debug_user_json)
    if response.status_code != 200:
        print(response)

    debug_user_json.update({"isSamePic": "true", "nbPics": random.randint(1, 5)})

    response = session.post(API_URL + "user/debugUpload", data=debug_user_json, files=files)
    if response.status_code != 200:
        print(response)