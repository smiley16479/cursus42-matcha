#! /usr/bin/python

from randomtimestamp import randomtimestamp
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

DEFAULT_EMAIL = "francois@42l.fr"

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

for userNb in tqdm (range(nbProfiles), desc="Populating database ..."):

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
    sexualPref = random.choice(list(ESexualPref)).value
    biography = lorem.paragraph()
    [latitude, longitude, *_] = fake.local_latlng(country_code='FR')
    lastConnection = str(datetime.now() - timedelta(days=random.uniform(0, 365)))
    interests = [random.choice(list(EInterest)).value for _ in range(random.randint(0, 20))]

    # Signup
    signup_json = {
        "email": DEFAULT_EMAIL,
        "firstName": firstName,
        "lastName": lastName,
        "userName": userName,
        "password": password
    }

    response = session.post(API_URL + "user/create", json=signup_json)
    if response.status_code != 200:
        print(response)

    # Signin
    signin_json = {
        "userName": userName,
        "password": password
    }

    response = session.post(API_URL + "user/login", json=signin_json)
    if response.status_code != 200:
        print(response)
    # Update
    patch_json = {
        "gender": gender,
        "sexualPref": sexualPref,
        "biography": biography,
        "latitude": latitude,
        "longitude": longitude,
        "lastConnection": lastConnection,
        "interests": interests
    }

    response = session.patch(API_URL + "user/patch", json=patch_json)
    if response.status_code != 200:
        print(response)
    # Upload pictures
    if actual_gender == "Female":
        picture_path = FEMALE_PICTURES_FOLDER + str(nbFemaleProfiles) + "_f.webp"
    else:
        picture_path = MALE_PICTURES_FOLDER + str(nbMaleProfiles) + "_m.webp"
    picture = open(picture_path, 'rb').read()
    files = {'picture': (picture_path.split("/")[-1], picture, "image/webp")}
    data = {'index': 1}
    response = session.post(API_URL + "user/picture/upload", data=data, files=files)
    if response.status_code != 200:
        print(response)