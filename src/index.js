import $ from 'jquery';

let state = {
  searchInput: '',
  maxResults: 10
};

const parkInfo = {
  fullNames: [],
  descriptions: [],
  urls: []
};

let states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

// html generators
const formGenerator = () => {
  return '<h1>National Parks Search</h1><form><label for="stateSelect">Select a State</label><select></select><label for="resultsNum">Number of Results</label><input type="number" min="10" value="10"><input type="submit"></form>';
};

const stateOptionGenerator = () => {
  return states.map(state => `<option value="${state}">${state}</option>`);
};

const resultsGenerator = () => {
  let html = [];
  for (let i = 0; i < parkInfo.urls.length; i++) {
    html.push(`<li><h3>${parkInfo.fullNames[i]}</h3><p>${parkInfo.descriptions[i]}</p><a href="${parkInfo.urls[i]}>Link to Park Website</a></li>`);
  }
  return html;
};

// render functions
const render = () => {
  let page = formGenerator();
  if (parkInfo.fullNames.length > 0) {
    page += `<ul>${resultsGenerator()}</ul>`;
  }
  $('body').html(page);
  $('select').html(stateOptionGenerator());
};

// event handlers
const submitHandler = function () {
  $('body').on('submit', 'form', function (e) {
    e.preventDefault();
    let stateValue = $('select').val();
    state.maxResults = $('input[type="number"]').val();
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateValue}&limit=${state.maxResults}&api_key=R80DYBt41aHDGuvX0vT5OV3xxbFlgTEmnLLaeYp6`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }).then(parks => {
        parks.data.forEach(d => parkInfo.fullNames.push(d.fullName));
        parks.data.forEach(d => parkInfo.descriptions.push(d.description));
        parks.data.forEach(d => parkInfo.urls.push(d.url));
        render();
      }).catch(err => {
        console.error(err);
      });
  });
};


const main = () => {
  render();
  submitHandler();
};


$(main);