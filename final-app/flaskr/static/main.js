"use strict";
class MainTabs {
  constructor() {
    this.list = document.querySelector(".nav-list");
    this.btns = this.list.querySelectorAll("li");
    this.tabs = document.querySelectorAll(".tab");
    this.active;

    this.btns.forEach(btn => {
      btn.addEventListener("click", e => {
        if (e.target === this.list.querySelector(`[data-tab=${this.active}]`)) return;
        this.open(btn.dataset.tab);
      });
    });
  }

  open(name) {
    this.close();
    this.active = name;
    [...this.tabs].find(tab => tab.dataset.name === name).classList.add("active");
    this.list.querySelector(`[data-tab=${name}]`)?.classList.add("active");
  
    // document.querySelector(".content").style.background = `
    //   hsl(${Math.random() * 360}, ${Math.random() * 20 + 60}%, ${Math.random() * 10 + 60}%)
    // `
  }

  close() {
    this.list.querySelector(`[data-tab=${this.active}]`)?.classList.remove("active");
    [...this.tabs].find(tab => tab.dataset.name === this.active)?.classList.remove("active");
  }
}

const tabs = new MainTabs();
tabs.open("edu");

class Tabs {
  constructor(btnList, tabList) {
    this.btnList = btnList;
    this.tabList = tabList;
    this.active;

    [...this.btnList.querySelectorAll("li")].forEach((btn, i) => {
      btn.addEventListener("click", () => this.open(i));
    });
  }

  open(idx) {
    this.close();
    this.active = idx;
    this.tabList.querySelectorAll(".edu-tab")[idx].classList.add("active");
    this.btnList.querySelectorAll("li")[idx].classList.add("active");
  }

  close() {
    this.tabList.querySelectorAll(".edu-tab")[this.active]?.classList.remove("active");
    this.btnList.querySelectorAll("li")[this.active]?.classList.remove("active");
  }
}

const eduTabs = new Tabs(document.querySelector(".edu-tab-btns"), document.querySelector(".edu-tabs"));
eduTabs.open(1);

const options = {
  url: 'https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2',
  method: 'GET',
  params: {
    type: 'public',
    co2EmissionsClass: 'A+',
    'field[0]': 'uri',
    beta: 'true',
    random: 'true',
    'cuisineType[0]': 'American',
    'imageSize[0]': 'LARGE',
    'mealType[0]': 'Breakfast',
    'health[0]': 'alcohol-cocktail',
    'diet[0]': 'balanced',
    'dishType[0]': 'Biscuits and cookies'
  },
  headers: {
    'Accept-Language': 'en',
    'X-RapidAPI-Key': '91864cd809mshf6b43f15fe0b457p106bbbjsnc5821a8f4b3f',
    'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
  }
};

function addFoods(data) {
  const container = document.querySelector(`.edu-tabs > div:nth-child(3)`);
  
  data.hits.forEach(obj => {
    const recipe = obj.recipe;
    
    const card = createHTML(`
    <div class="card">
      <img src="${recipe.image}"/>
      <div class="card-content">
      <div class="card-label">${recipe.label}</div>
        <div class="card-cuisine_type">${recipe.cuisineType[0]}</div>
        </div>
    </div>
    `);

    container.append(card);
  });
}

function addExercises(data) {
  const container = document.querySelector(`.edu-tabs > div:nth-child(2)`);
  
  data.forEach(obj => {
    const card = createHTML(`
      <div class="card difficulty-${obj.difficulty}">
        <span class="card-difficulty">${obj.difficulty}</span>
        <span class="card-label">${obj.name}</span>
        <span class="card-muscle">${obj.muscle}</span>
        <div class="card-desc">${obj.instructions}</div>
      </div>
    `);

    container.append(card);
  });
}

function fetchArticles() {
  let url = 'https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2?type=public&co2EmissionsClass=A%2B&field%5B0%5D=uri&beta=true&random=true&cuisineType%5B0%5D=American&imageSize%5B0%5D=LARGE&mealType%5B0%5D=Breakfast&health%5B0%5D=alcohol-cocktail&diet%5B0%5D=balanced&dishType%5B0%5D=Biscuits%20and%20cookies';
  const options = {
    method: 'GET',
    headers: {
      'Accept-Language': 'en',
      'X-RapidAPI-Key': 'bb8fd7f7d2msh7280dcffb538a39p130dc6jsn359af37fd8f9',
      'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
    }
  };
  
  fetch(url, options)
    .then(res => res.json())
    .then(addFoods)
    .catch(console.error);
  
  url = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises';
  options.headers["X-RapidAPI-Host"] = "exercises-by-api-ninjas.p.rapidapi.com";
  options.headers["X-RapidAPI-Key"] = "91864cd809mshf6b43f15fe0b457p106bbbjsnc5821a8f4b3f";

  fetch(url, options)
    .then(res => res.json())
    .then(addExercises)
    .catch(console.error);
}

fetchArticles();

function createHTML(str) {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div.firstElementChild;
}

class ChatBot {
  constructor() {
    this.input = document.querySelector(".bot-inp");
    this.btn = document.querySelector(".bot-send");
    this.container = document.querySelector(".chats");

    this.input.addEventListener("keydown", e => {
      if (e.key === "Enter") this.send(this.input.value);
    });

    this.btn.addEventListener("click", () => this.send(this.input.value));
  }

  send(symptom) {
    const userBubble = createHTML(`
      <div class="chat user">
        ${symptom}
      </div>
    `);

    const idx = ChatBot.symptoms.findIndex(s => s === symptom.toLowerCase());
    console.log(idx);
    const botBubble = createHTML(`
      <div class="chat bot">
        ${idx >= 0 ? `Based on your symptoms, it could be related to ${ChatBot.diseases[idx]}. Please consult a healthcare professional for a proper diagnosis.` : "I cannot diagnose your condition. Please consult a medical professional for an accurate diagnosis."}
      </div>
    `);

    this.container.append(userBubble, botBubble);
    botBubble.scrollIntoView();
    this.input.value = "";
  }
  
  static symptoms = [
    "fever",
    "cough",
    "shortness of breadth",
    "fatigue",
    "headache",
    "chest pain",
    "abdominal pain",
    "nausea",
    "vomitting",
    "diarrhoea",
    "constipation",
    "joint pain",
    "muscle pain",
    "skin rash",
    "itching",
    "weight loss",
    "weight gain",
    "swelling",
    "frequent urination",
    "blood in urine",
    "changes in urine colour",
    "blood in stool",
    "dark stool",
    "light stool",
    "heart palpitations",
    "dizziness",
    "vision changes",
    "hearing loss",
    "memory loss",
    "seizures",
    "tremors",
    "difficulty in swallowing",
    "excessive thirst",
    "excessive sweating",
    "chest tightness",
    "back pain",
    "difficulty in breathing",
    "gas",
    "night sweats",
    "frequent headaches",
    "hair loss",
    "red eyes",
    "joint swelling",
    "irregular menstrual periods",
    "short term memory loss",
    "disorientation",
    "sore throat",
    "frequent nosebleeds",
    "cold hands and feet",
    "numbness"
  ];

  static diseases = [
    "Common cold, Influenza, COVID-19, Malaria",
    "Bronchitis, Pneumonia, Asthma, Lung Cancer",
    "Chronic Obstructive Pulmonary Disease (COPD), Heart Failure, Anxiety",
    "Anemia, Chronic Fatigue Syndrome, Diabetes",
    "Migraine, Tension Headache, Sinusitis",
    "Angina, Heart Attack, Gastroesophageal Reflux Disease (GERD)",
    "Appendicitis, Gastritis, Irritable Bowel Syndrome (IBS)",
    " Pregnancy, Food Poisoning, Gastroenteritis",
    "Norovirus Infection, Motion Sickness, Bulimia",
    "Gastroenteritis, Irritable Bowel Syndrome (IBS), Crohn's Disease",
    " Irritable Bowel Syndrome (IBS), Hemorrhoids, Colon Cancer",
    "Arthritis, Rheumatoid Arthritis, Lupus",
    " Fibromyalgia, Muscle Strain, Myositis",
    "Eczema, Psoriasis, Allergic Reaction",
    " Dermatitis, Scabies, Allergies",
    "Hyperthyroidism, Diabetes, Cancer",
    "Hypothyroidism, Polycystic Ovary Syndrome (PCOS), Cushing's Syndrome",
    "Edema, Lymphedema, Kidney Disease",
    "Urinary Tract Infection (UTI), Diabetes, Prostate Enlargement",
    " Kidney Stones, Urinary Tract Infection (UTI), Bladder Cancer",
    "Liver Disease, Dehydration, Hematuria",
    "Colorectal Cancer, Hemorrhoids, Anal Fissures",
    "Gastrointestinal Bleeding, Iron Supplements",
    "Gallbladder Disease, Liver Disease, Pancreatic Cancer",
    "Arrhythmia, Anxiety, Heart Disease",
    "Vertigo, Orthostatic Hypotension, Anemia",
    " Glaucoma, Macular Degeneration, Diabetes",
    "Presbycusis, Ear Infection, Meniere's Disease",
    "Alzheimer's Disease, Dementia, Depression",
    "Epilepsy, Febrile Seizures, Brain Tumor",
    "Parkinson's Disease, Essential Tremor, Multiple Sclerosis",
    "Dysphagia, Gastroesophageal Reflux Disease (GERD), Stroke",
    "Diabetes, Diabetes Insipidus, Dehydration",
    " Hyperhidrosis, Menopause, Thyroid Disorders",
    "Asthma, Anxiety, Angina",
    "Herniated Disc, Muscle Strain, Osteoarthritis",
    "- Asthma, Chronic Obstructive Pulmonary Disease (COPD), Anxiety",
    "Irritable Bowel Syndrome (IBS), Lactose Intolerance, Gastroenteritis",
    "Menopause, Infections, Cancer",
    "Chronic Migraines, Tension Headaches, Cluster Headaches",
    "Androgenetic Alopecia, Alopecia Areata, Thyroid Disorders",
    " Conjunctivitis, Allergies, Eye Infections",
    "Rheumatoid Arthritis, Gout, Osteoarthritis",
    "Polycystic Ovary Syndrome (PCOS), Endometriosis, Menopause",
    "Concussion, Alzheimer's Disease, Stress",
    "Delirium, Alzheimer's Disease",
    "Pharyngitis, Strep Throat, Mononucleosis",
    "Dry Air, Allergies, Nasal Trauma",
    "Raynaud's Disease, Peripheral Artery Disease, Hypothyroidism",
    "Peripheral Neuropathy, Multiple Sclerosis, Carpal Tunnel Syndrome"
  ];
}

const bot = new ChatBot();
