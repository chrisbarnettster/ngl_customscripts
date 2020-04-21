// A simple viewer script for ngl. Hardcoded for STAT3

// Inspired by examples provided in nglviewer.

var pdbid = '6QHD'; // This is the PDBID for STAT3
let rcsb_link = 'rcsb://' + pdbid;
let rcsb_http_link = 'https://www.rcsb.org/structure/' + pdbid;
let git_http_link = 'https://raw.githubusercontent.com/chrisbarnettster/ngl_customscripts/master/data/STAT3CombinedCompleteHomology.pdb';
let customview = [-133.75,-59.66,-78.45,0,-82.78,139.78,34.83,0,53.49,67.12,-142.25,0,0.41,-23.72,-29.5,1] 

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
      sele: '[367 367 108]',
      scale: 0.50,
      color: "yellow",
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
      sele: '[108 108 687]',
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
      name: 'phosphorylation',
      visible: phosphorylationCheckbox.checked,
      sele: '[705 705 727 714]', // Note 705 is phosphorylated in this PDB
      scale: 0.50,
      color: "pink",
      background: false,
      contour: false
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight where phosphorylation occurs with a surface.
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'TAD_region',
      visible: tadregionCheckbox.checked,
      sele: '690-770',
      scale: 0.50,
      color: 'lightblue',
      background: true,
      opacity: 0.8
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the transactivation domain (TAD).
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

    collection.forEach((item) => o.addRepresentation(item.rep, item.repdetails))


    // Create an annotation highlighting the phosphorylated tyrosine 705
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 705 )')
    var selpho =  s.getAtomSetWithinSelection(pho) // new NGL.Selection(sele), 5)
    var apv = s.atomCenter(pho)

    var elm = document.createElement('div')
    elm.innerText = "Y705"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'pink'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the PHOS
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 714 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "T714"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'pink'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)
    // Create an annotation highlighting the PHOS
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 727 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "S727"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'pink'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the PHOS
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 705 714 727 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "Phosphorylated Residues"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'pink'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 108
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 108 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C108"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'yellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 251
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 251 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C251"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 259
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 259 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C259"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 328
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 328 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C328"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 367
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 367 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C367"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'yellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 418
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 418 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C418"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 426
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 426 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C426"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 468
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 468 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C468"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 542
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 542 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C542"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 550
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 550 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C550"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 687
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 687 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C687"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'yellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 712
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 712 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C712"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 718
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 718 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C718"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)

    // Create an annotation highlighting the CYS 765
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 765 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "C765"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'lightyellow'
    elm.style.padding = '2px'
    o.addAnnotation(apv, elm)


    // Create an annotation highlighting the TAD region 690-770
    var s = o.structure
    var pho = new NGL.Selection(':A and ( 690-770 )')
    var apv = s.atomCenter(pho)
    var elm = document.createElement('div')
    elm.innerText = "TAD region"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'skyblue'
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
        name: 'polymer',
        quality: 'user',
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

var phosphorylationCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show phosphorylated residues. sele: "[705 727 714]"',
  onchange: function (e) {
    stage.getRepresentationsByName('phosphorylation')
      .setVisibility(e.target.checked)
  }
}, { top: '155px', left: '12px' })
addElement(phosphorylationCheckbox)
addElement(createElement('span', {
  innerText: 'phosphorylation'
}, { top: '155px', left: '32px' }))

var tadregionCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the Trans Activation Domain (TAD) sele: "690-770"',
  onchange: function (e) {
    stage.getRepresentationsByName('TAD_region')
      .setVisibility(e.target.checked)
  }
}, { top: '175px', left: '12px' })
addElement(tadregionCheckbox)
addElement(createElement('span', {
  innerText: 'TAD region'
}, { top: '175px', left: '32px' }))

var waterIonCheckbox = createElement('input', {
  type: 'checkbox',
  checked: false, // do not show by default
  title: 'Select all water and ions using "water or ion"',
  onchange: function (e) {
    stage.getRepresentationsByName('waterIon')
      .setVisibility(e.target.checked)
  }
}, { top: '195px', left: '12px' })
addElement(waterIonCheckbox)
addElement(createElement('span', {
  innerText: 'water+ion'
}, { top: '195px', left: '32px' }))

// Centre the view
var centerButton = createElement('input', {
  type: 'button',
  title: 'Center the view',
  value: 'center',
  onclick: function () {
    stage.autoView(1000)
  }
}, { top: '220px', left: '12px' })
addElement(centerButton)

// button to open up the original PDB entry at the RCSB
var PDBButton = createElement('input', {
  type: 'button',
  title: 'Go to the RCSB for this PDBID',
  value: 'PDB',
  onclick: function () {
    window.open(rcsb_http_link, '_blank');
  }
}, { top: '248px', left: '12px' })
addElement(PDBButton)

//loadStructure('data://3SN6.cif')
loadStructure(git_http_link)


// Get orientation [-127.08,-58.06,-89.91,0,-81.81,142.68,23.5,0,69,62.25,-137.72,0,0.41,-23.72,-29.5,1]
// [-133.75,-59.66,-78.45,0,-82.78,139.78,34.83,0,53.49,67.12,-142.25,0,0.41,-23.72,-29.5,1]
