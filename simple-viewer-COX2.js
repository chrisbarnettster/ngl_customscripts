// A simple viewer script for ngl. Hardcoded for COX2

// Inspired by examples provided in nglviewer.

var pdbid = '5F19'; // This is the PDBID
let rcsb_link = 'rcsb://' + pdbid;
let rcsb_http_link = 'https://www.rcsb.org/structure/' + pdbid;
let git_http_link = 'https://raw.githubusercontent.com/chrisbarnettster/ngl_customscripts/master/data/1v0x_prep.pdb';
let customview = [-6.53,-106.23,-30.63,0,110.55,-6.42,-1.3,0,-0.52,-30.65,106.42,0,-25.99,-27.19,-13.77,1]

function addElement (el) {
  Object.assign(el.style, {
    position: 'absolute',
    zIndex: 10
  })
  stage.viewer.container.appendChild(el)
}

function createElement (name, properties, style) {
  var el = document.createElement(name)
  Object.assign(el, properties)
  Object.assign(el.style, style)
  return el
}

function createSelect (options, properties, style) {
  var select = createElement('select', properties, style)
  options.forEach(function (d) {
    select.add(createElement('option', {
      value: d[ 0 ], text: d[ 1 ]
    }))
  })
  return select
}

function createFileButton (label, properties, style) {
  var input = createElement('input', Object.assign({
    type: 'file'
  }, properties), { display: 'none' })
  addElement(input)
  var button = createElement('input', {
    value: label,
    type: 'button',
    onclick: function () { input.click() }
  }, style)
  return button
}

function loadStructure (input) {
  stage.removeAllComponents()
  return stage.loadFile(input).then(function (o) {
    o.autoView()

    let collection = [];

    collection.push({
      representation: polymerSelect.value,
      representationdetails:  {
      sele: 'polymer',
      name: 'polymer'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
     }); // Representation: all polymer type (this will be used to allow dynamics views later)
    collection.push({
      representation: 'surface',
      representationdetails:  {
      opacity: 0.2,
      side: 'front',
      surfaceType: 'vws',
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
     }); // Representation: A transparent surface over the whole structure
    collection.push({
      representation: 'ball+stick',
      representationdetails:  {
      name: 'ligand',
      visible: ligandCheckbox.checked,
      sele: 'not ( polymer or water or ion )'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Not polymer water and ions - that is probably ligand - and view as ball and stick
    collection.push({
      representation: 'spacefill',
      representationdetails:  {
      name: 'All cysteines',
      visible: cysteineCheckbox.checked,
      sele: 'CYS',
      scale: 0.50
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    });  // Representation: VDW surface for all Cysteine residues.
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'ZA modified cysteine(s)',
      visible: cysteine_ajoeneCheckbox.checked,
      sele: '[9 9 299]',
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight special cysteines where ajoene may attach with a surface.
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'DP modified cysteine(s)',
      visible: cysteine_DPCheckbox.checked,
      sele: '[9 9 299]', // this is actually 9 but +14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight DP modified cysteines
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'Aspirin acetylated serine',
      visible: acetylatedCheckbox.checked,
      sele: '516', // note this is 516 and 516 + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      color: 'lightblue'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight where acetylated occurs with a surface.
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'activesite',
      visible: activesiteCheckbox.checked,
      sele: '[193 193 371]', // and + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 0.8,
      color: 'lightgreen'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the active site
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'iron binding site',
      visible: ironbindingsiteCheckbox.checked,
      sele: '374', // and + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 0.8,
      color: 'lightpink'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the ironbinding site
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'substratebindingsite',
      visible: substratebindingsiteCheckbox.checked,
      sele: '341', // and + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 0.8,
      color: 'cyan'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the ironbinding site
    collection.push({
      representation: 'spacefill',
      representationdetails:  {
      name: 'waterIon',
      visible: waterIonCheckbox.checked,
      sele: 'water or ion',
      scale: 0.25
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }) // Representation: VDW view of water and ions. Note the checked settings are updated later.

    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'proximalbindingpocket',
      visible: true,
      sele: '[106 106 335 339 341 509 513]', // and + 14 for alignment for the 1V0X structure
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 1.0,
      surfaceType: 'sas',
      color: 'lightgreen'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the Proximal Binding pocket as per https://pubs.acs.org/doi/pdf/10.1021/acs.chemrev.0c00215
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'centralbindingpocket',
      visible: true,
      sele: '[338 338 370 371 373 367 508 512 516]', // and + 14 for alignment for the 1V0X structure
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 1.0,
      surfaceType: 'sas',
      color: 'green'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the Central Binding pocket as per https://pubs.acs.org/doi/pdf/10.1021/acs.chemrev.0c00215
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'cox2sidepocket',
      visible: true,
      sele: '[420 420 509 499]', // and + 14 for alignment for the 1V0X structure
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 1.0,
      surfaceType: 'sas',
      color: 'orange'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the Cox2 sidepocket as per https://pubs.acs.org/doi/pdf/10.1021/acs.chemrev.0c00215
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'oxicampocket',
      visible: true,
      sele: '[99 99 102 103 331 335 345 517 520 521]', // and + 14 for alignment for the 1V0X structure
      scale: 0.50,
      colorScheme: "resname",
      background: false,
      contour: false,
      opacity: 1.0,
      surfaceType: 'sas',
      color: 'purple'
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the Oxicam pocket as per https://pubs.acs.org/doi/pdf/10.1021/acs.chemrev.0c00215

    collection.forEach((item) => o.addRepresentation(item.rep, item.repdetails))


    // Create an annotation highlighting the CYS 9
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 9 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C9"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'yellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 299
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 299 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C299"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'yellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 21
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 21 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C21"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 22
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 22 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C22"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 26
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 26 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C26"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 32
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 32 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C32"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 42
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 42 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C42"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 44
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 44 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C44"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 54
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 54 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C54"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 145
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 145 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C145"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 526
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 526 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C526"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 555
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 555 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C555"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 561
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 561 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C561"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the SER 516
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 516 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "Acetylated\n S516"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightblue'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the active site
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 193 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "H193"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightgreen'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    var s = o.structure
    var pho = new NGL.Selection(':A and ( 371 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "Y371"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightgreen'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    var s = o.structure
    var pho = new NGL.Selection(':A and ( 193 371 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "Active site"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightgreen'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the iron binding
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 374 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "Iron Binding\n Y374"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightpink'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the substrate binding
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 341 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "Substrate binding\n Y341"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'cyan'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)
    o.autoView()
    o.stage.viewerControls.orient(customview) 
  })
}

// Allow loading of other PDB. Probably remove this button as this is getting pretty hardcoded for the pdbid
var loadStructureButton = createFileButton('load structure', {
  accept: '.pdb,.cif,.ent,.gz',
  onchange: function (e) {
    if (e.target.files[ 0 ]) {
      loadStructure(e.target.files[ 0 ])
    }
  }
}, { top: '12px', left: '12px' })
addElement(loadStructureButton)

// Dynamically change the representation for the polymer selection
var polymerSelect = createSelect([
  [ 'cartoon', 'cartoon' ],
  [ 'spacefill', 'spacefill' ],
  [ 'licorice', 'licorice' ],
  [ 'surface', 'surface' ]
], {
  onchange: function (e) {
    stage.getRepresentationsByName('polymer').dispose()
    stage.eachComponent(function (o) {
      o.addRepresentation(e.target.value, {
        sele: 'polymer',
        name: 'polymer'
      })
    })
  }
}, { top: '40px', left: '12px' })
addElement(polymerSelect)

// A whole lot of check boxes for specific parts of the protein.
var ligandCheckbox = createElement('input', {
  type: 'checkbox',
  checked: false,
  title: 'Show ligand. sele: "not ( polymer or water or ion )"',
  onchange: function (e) {
    stage.getRepresentationsByName('ligand')
      .setVisibility(e.target.checked)
  }
}, { top: '75px', left: '12px' })
addElement(ligandCheckbox)
addElement(createElement('span', {
  innerText: 'ligand'
}, { top: '75px', left: '32px' }))

var cysteineCheckbox = createElement('input', {
  type: 'checkbox',
  checked: false,
  title: 'Show all cysteines. sele: "CYS"',
  onchange: function (e) {
    stage.getRepresentationsByName('All cysteines')
      .setVisibility(e.target.checked)
  }
}, { top: '95px', left: '12px' })
addElement(cysteineCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine'
}, { top: '95px', left: '32px' }))

var cysteine_ajoeneCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show cysteines where ajoene attaches.',
  onchange: function (e) {
    stage.getRepresentationsByName('ZA modified cysteine(s)')
      .setVisibility(e.target.checked)
  }
}, { top: '115px', left: '12px' })
addElement(cysteine_ajoeneCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine_ajoene'
}, { top: '115px', left: '32px' }))

var cysteine_DPCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show cysteines where DP attaches',
  onchange: function (e) {
    stage.getRepresentationsByName('DP modified cysteine(s)')
      .setVisibility(e.target.checked)
  }
}, { top: '135px', left: '12px' })
addElement(cysteine_DPCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine_DP'
}, { top: '135px', left: '32px' }))

var acetylatedCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Aspirin acetylated serine',
  onchange: function (e) {
    stage.getRepresentationsByName('Aspirin acetylated serine')
      .setVisibility(e.target.checked)
  }
}, { top: '155px', left: '12px' })
addElement(acetylatedCheckbox)
addElement(createElement('span', {
  innerText: 'acetylated'
}, { top: '155px', left: '32px' }))

var activesiteCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the Active site',
  onchange: function (e) {
    stage.getRepresentationsByName('activesite')
      .setVisibility(e.target.checked)
  }
}, { top: '175px', left: '12px' })
addElement(activesiteCheckbox)
addElement(createElement('span', {
  innerText: 'active site'
}, { top: '175px', left: '32px' }))

var ironbindingsiteCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the iron binding site',
  onchange: function (e) {
    stage.getRepresentationsByName('iron binding site')
      .setVisibility(e.target.checked)
  }
}, { top: '195px', left: '12px' })
addElement(ironbindingsiteCheckbox)
addElement(createElement('span', {
  innerText: 'ironbinding site'
}, { top: '195px', left: '32px' }))

var substratebindingsiteCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the substrate binding site',
  onchange: function (e) {
    stage.getRepresentationsByName('substratebindingsite')
      .setVisibility(e.target.checked)
  }
}, { top: '215px', left: '12px' })
addElement(substratebindingsiteCheckbox)
addElement(createElement('span', {
  innerText: 'substrate binding site'
}, { top: '215px', left: '32px' }))


var waterIonCheckbox = createElement('input', {
  type: 'checkbox',
  checked: false, // do not show by default
  title: 'Select all water and ions using "water or ion"',
  onchange: function (e) {
    stage.getRepresentationsByName('waterIon')
      .setVisibility(e.target.checked)
  }
}, { top: '235px', left: '12px' })
addElement(waterIonCheckbox)
addElement(createElement('span', {
  innerText: 'water+ion'
}, { top: '235px', left: '32px' }))

// Centre the view
var centerButton = createElement('input', {
  type: 'button',
  title: 'Center the view',
  value: 'center',
  onclick: function () {
    stage.autoView(1000)
  }
}, { top: '260px', left: '12px' })
addElement(centerButton)

// button to open up the original PDB entry at the RCSB
var PDBButton = createElement('input', {
  type: 'button',
  title: 'Go to the RCSB for this PDBID',
  value: 'PDB',
  onclick: function () {
    window.open(rcsb_http_link, '_blank');
  }
}, { top: '288px', left: '12px' })
addElement(PDBButton)

//loadStructure('data://3SN6.cif')
//loadStructure(rcsb_link)
loadStructure(git_http_link)

//orientation [-6.53,-106.23,-30.63,0,110.55,-6.42,-1.3,0,-0.52,-30.65,106.42,0,-25.99,-27.19,-13.77,1]
//orientation used for view of pockets [63.22,28.54,80.6,0,22.76,-102.24,18.34,0,82.41,6.34,-66.89,0,-25.99,-27.19,-13.77,1]
