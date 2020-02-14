// A simple viewer script for ngl. Hardcoded for STAT3

// Inspired by examples provided in nglviewer.

var pdbid = '5F19'; // This is the PDBID for STAT3
let rcsb_link = 'rcsb://' + pdbid;
let rcsb_http_link = 'https://www.rcsb.org/structure/' + pdbid;

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
      opacity: 0.3,
      side: 'front'
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
      name: 'cysteine',
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
      name: 'cysteine_ajoene',
      visible: cysteine_ajoeneCheckbox.checked,
      sele: '313', // this is actually 299 but +14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: true,
      contour: true
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight special cysteines where ajoene may attach with a surface.
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'cysteine_DP',
      visible: cysteine_DPCheckbox.checked,
      sele: '23', // this is actually 9 but +14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: true,
      contour: true
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight static cysteines with a surface. This added in commit 46d722430289ac2516094ac83775c7216f7f36fcr . Unsure what I meant, must find the definition
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'acetylated',
      visible: acetylatedCheckbox.checked,
      sele: '530', // note this is 516 and 516 + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      background: true,
      contour: true
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight where acetylated occurs with a surface.
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'activesite',
      visible: activesiteCheckbox.checked,
      sele: '[207 385]', // and + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      opacity: 0.8
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the active site
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'ironbindingsite',
      visible: ironbindingsiteCheckbox.checked,
      sele: '388', // and + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      opacity: 0.8
      },
      get rep() { return this.representation; },
      get repdetails() { return this.representationdetails; },
    }); // Representation: Highlight the ironbinding site
    collection.push({
      representation: 'surface',
      representationdetails:  {
      name: 'substratebindingsite',
      visible: substratebindingsiteCheckbox.checked,
      sele: '355', // and + 14 for alignment
      scale: 0.50,
      colorScheme: "resname",
      opacity: 0.8
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

    collection.forEach((item) => o.addRepresentation(item.rep, item.repdetails))


    // Create an annotation highlighting the phosphorylated tyrosine 705
    var s = o.structure.getAtomProxy()
    var elm = document.createElement('div')
    elm.innerText = "PHOSPHORYLATED TYROSINE 705"
    elm.style.color = 'black'
    elm.style.backgroundColor = 'skyblue'
    elm.style.padding = '8px'
    o.addAnnotation(s.positionToVector3(), elm)

    o.autoView()
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
}, { top: '36px', left: '12px' })
addElement(polymerSelect)

// A whole lot of check boxes for specific parts of the protein.
var ligandCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show ligand. sele: "not ( polymer or water or ion )"',
  onchange: function (e) {
    stage.getRepresentationsByName('ligand')
      .setVisibility(e.target.checked)
  }
}, { top: '60px', left: '12px' })
addElement(ligandCheckbox)
addElement(createElement('span', {
  innerText: 'ligand'
}, { top: '60px', left: '32px' }))

var cysteineCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show cysteines. sele: "CYS"',
  onchange: function (e) {
    stage.getRepresentationsByName('cysteine')
      .setVisibility(e.target.checked)
  }
}, { top: '84px', left: '12px' })
addElement(cysteineCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine'
}, { top: '84px', left: '32px' }))

var cysteine_ajoeneCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show cysteines where ajoene attaches. sele: "[367 687 108]"',
  onchange: function (e) {
    stage.getRepresentationsByName('cysteine_ajoene')
      .setVisibility(e.target.checked)
  }
}, { top: '108px', left: '12px' })
addElement(cysteine_ajoeneCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine_ajoene'
}, { top: '108px', left: '32px' }))

var cysteine_DPCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show static cysteines (whatever that means?!) residues. sele: "[251 259 367 426]"',
  onchange: function (e) {
    stage.getRepresentationsByName('cysteine_DP')
      .setVisibility(e.target.checked)
  }
}, { top: '132px', left: '12px' })
addElement(cysteine_DPCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine_DP'
}, { top: '132px', left: '32px' }))

var acetylatedCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show phosphorylated residues. sele: "[705 727 714]"',
  onchange: function (e) {
    stage.getRepresentationsByName('acetylated')
      .setVisibility(e.target.checked)
  }
}, { top: '156px', left: '12px' })
addElement(acetylatedCheckbox)
addElement(createElement('span', {
  innerText: 'acetylated'
}, { top: '156px', left: '32px' }))

var activesiteCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the Active site"',
  onchange: function (e) {
    stage.getRepresentationsByName('activesite')
      .setVisibility(e.target.checked)
  }
}, { top: '180px', left: '12px' })
addElement(activesiteCheckbox)
addElement(createElement('span', {
  innerText: 'active site'
}, { top: '180px', left: '32px' }))

var ironbindingsiteCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the iron binding site sele: "690-770"',
  onchange: function (e) {
    stage.getRepresentationsByName('ironbindingsite')
      .setVisibility(e.target.checked)
  }
}, { top: '204px', left: '12px' })
addElement(ironbindingsiteCheckbox)
addElement(createElement('span', {
  innerText: 'ironbinding site'
}, { top: '204px', left: '32px' }))

var substratebindingsiteCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  title: 'Show the substrate binding site',
  onchange: function (e) {
    stage.getRepresentationsByName('substratebindingsite')
      .setVisibility(e.target.checked)
  }
}, { top: '228px', left: '12px' })
addElement(substratebindingsiteCheckbox)
addElement(createElement('span', {
  innerText: 'substrate binding site'
}, { top: '228px', left: '32px' }))


var waterIonCheckbox = createElement('input', {
  type: 'checkbox',
  checked: false, // do not show by default
  title: 'Select all water and ions using "water or ion"',
  onchange: function (e) {
    stage.getRepresentationsByName('waterIon')
      .setVisibility(e.target.checked)
  }
}, { top: '252px', left: '12px' })
addElement(waterIonCheckbox)
addElement(createElement('span', {
  innerText: 'water+ion'
}, { top: '252px', left: '32px' }))

// Centre the view
var centerButton = createElement('input', {
  type: 'button',
  title: 'Center the view',
  value: 'center',
  onclick: function () {
    stage.autoView(1000)
  }
}, { top: '276px', left: '12px' })
addElement(centerButton)

// button to open up the original PDB entry at the RCSB
var PDBButton = createElement('input', {
  type: 'button',
  title: 'Go to the RCSB for this PDBID',
  value: 'PDB',
  onclick: function () {
    window.open(rcsb_http_link, '_blank');
  }
}, { top: '300px', left: '12px' })
addElement(PDBButton)

//loadStructure('data://3SN6.cif')
loadStructure(rcsb_link)
