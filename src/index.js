'use strict';

/**
 * Based on a 5 lines/mm
 * CoC = 1 / (lines/mm * (diagonal^8x10 print / diagonal^filmFormat))
 */
const circleOfConfusionForFormats = {
  '35mm': 0.026,
  '645': 0.043,
  '6x6': 0.049,
  '6x7': 0.055,
  '6x9': 0.062,
  '6x12':0.077,
  '6x17':0.109,
  '4x5': 0.15,
  '5x7': 0.135,
  '8x10': 0.2,
  '11x14': 0.25
};

const conversionsOfUnits = {
  feet: 304.8,
  meters: 1000,
}

const strings = {
  feet: "ft",
  meters: "m",
}

/** @const */
const appOpts = {
  dom: {
    body: document.querySelector('body'),
    kitsSelect: document.querySelector('#kits'),
    addKitButton: document.querySelector('#addNewKit'),
    removeKitButton: document.querySelector('#removeKit'),
    addKitForm: document.querySelector('#addKit'),
    saveKit: document.querySelector('#saveKit'),
    discardKit: document.querySelector('#discardKit'),
    aperture: document.querySelector('#aperture'),
    subjectDistance: document.querySelector('#subjectDistance'),
    convertUnits: document.querySelector('#unit'),
    calculations: {
      nearSharp: document.querySelector('#calculationsNearSharp'),
      farSharp: document.querySelector('#calculationsFarSharp'),
      dof: document.querySelector('#calculationsDof'),
      hyperfocal: document.querySelector('#calculationsHyperfocal'),
      dofHyperfocal: document.querySelector('#calculationsDofHyperfocal'),
    }
  },
  kits: null,
};

appOpts.dom.addKitButton.addEventListener('click', (event) => {
  appOpts.dom.addKitForm.classList.toggle('hidden');
});

appOpts.dom.removeKitButton.addEventListener('click', (event) => {
  if (window.confirm(`Are you sure you want to delete ${appOpts.dom.kitsSelect.selectedOptions[0].text}`)) {
    const which = appOpts.kits.findIndex((item) => item.id == appOpts.dom.kitsSelect.selectedOptions[0].value);
    appOpts.kits.splice(which, 1);

    appOpts.dom.kitsSelect.remove(appOpts.dom.kitsSelect.selectedOptions[0].index);

    localStorage.setItem('kits', JSON.stringify(appOpts.kits));
  }
});

appOpts.dom.saveKit.addEventListener('click', (event) => {
  const kit = {};
  [...appOpts.dom.addKitForm.elements]
    .filter(element => element.nodeName === 'INPUT' || element.nodeName === 'SELECT')
    .forEach((element) => {
      kit[element.name] = element.value;
    });

  kit.id = Date.now();

  saveKit(kit);
  addKitToSelectList(kit);

  appOpts.dom.addKitForm.classList.toggle('hidden');
});

const saveKit = (kit) => {
  appOpts.kits.push(kit);
  localStorage.setItem('kits', JSON.stringify(appOpts.kits));
}

const addKitToSelectList = (kit) => {
  const option = document.createElement('option');

  option.value = kit.id;
  option.text = `${kit.name} [${kit.format} @ ${kit.lens}mm]`;

  appOpts.dom.kitsSelect.add(option, null);
}

const toggleReadoutButtons = () => {
  appOpts.dom.showKmh.classList.toggle('selected');
  appOpts.dom.showMph.classList.toggle('selected');
};

const hyperfocalDistance = (focalLength, aperture, circleOfConfusion) => {
  return (focalLength * focalLength) / (aperture * circleOfConfusion);
}

const nearPointFocusDistance = (hyperfocalDistance, subjectDistance, focalLength) => {
  return (hyperfocalDistance * subjectDistance) / (hyperfocalDistance + (subjectDistance - focalLength));
}

const farPointFocusDistance = (hyperfocalDistance, subjectDistance, focalLength) => {
  return (hyperfocalDistance * subjectDistance) / (hyperfocalDistance - (subjectDistance - focalLength));
}

const totalDepthOfField = (farPointFocusDistance, nearPointFocusDistance) => {
  return farPointFocusDistance - nearPointFocusDistance;
}

const calculate = () => {
  const subjectDistance = appOpts.dom.subjectDistance.value;
  const aperture = appOpts.dom.aperture.selectedOptions[0].value;
  const convertUnit = conversionsOfUnits[appOpts.dom.convertUnits.selectedOptions[0].value];
  const convertString = strings[appOpts.dom.convertUnits.selectedOptions[0].value];

  const whichKit = appOpts.kits.find((item) => item.id == appOpts.dom.kitsSelect.selectedOptions[0].value);
  const circleOfConfusion = circleOfConfusionForFormats[whichKit.format];

  // Convert the target to millimeters
  const subjectDistanceMm = subjectDistance * convertUnit;

  const _hyperfocalDistance = hyperfocalDistance(whichKit.lens, aperture, circleOfConfusion);
  const _nearPointFocusDistance = nearPointFocusDistance(_hyperfocalDistance, subjectDistanceMm, whichKit.lens);
  const _farPointFocusDistance = farPointFocusDistance(_hyperfocalDistance, subjectDistanceMm, whichKit.lens);
  const _totalDepthOfField = totalDepthOfField(_farPointFocusDistance, _nearPointFocusDistance);

  appOpts.dom.calculations.nearSharp.textContent = `${Number.parseFloat(_nearPointFocusDistance/convertUnit).toFixed(2)}${convertString}`;
  appOpts.dom.calculations.farSharp.textContent = `${Number.parseFloat(_farPointFocusDistance/convertUnit).toFixed(2)}${convertString}`;
  appOpts.dom.calculations.dof.textContent = `${Number.parseFloat(_totalDepthOfField/convertUnit).toFixed(2)}${convertString}`;
  appOpts.dom.calculations.hyperfocal.textContent = `${Number.parseFloat(_hyperfocalDistance/convertUnit).toFixed(2)}${convertString}`;
  appOpts.dom.calculations.dofHyperfocal.textContent = `${Number.parseFloat((_hyperfocalDistance/2)/convertUnit).toFixed(2)}${convertString} - ∞`;
}

const startUp = () => {
  try {
    appOpts.kits = JSON.parse(localStorage.getItem('kits'));
  } catch(error) {
    // first run I suspect
  }
  if (!appOpts.kits) {
    appOpts.kits = [];
  } else {
    appOpts.kits.forEach((kit) => {
      addKitToSelectList(kit);
    })
  }
  appOpts.dom.kitsSelect.onchange = calculate;
  appOpts.dom.aperture.onchange = calculate;
  appOpts.dom.convertUnits.onchange = calculate;
  appOpts.dom.subjectDistance.onchange = calculate;
};

const startServiceWorker = () => {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  });
}

startUp();
startServiceWorker();