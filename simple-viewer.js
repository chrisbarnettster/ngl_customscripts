
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
    o.addRepresentation(polymerSelect.value, {
      sele: 'polymer',
      name: 'polymer'
    })
    o.addRepresentation('ball+stick', {
      name: 'ligand',
      visible: ligandCheckbox.checked,
      sele: 'not ( polymer or water or ion )'
    })
    o.addRepresentation('spacefill', {
      name: 'cysteine',
      visible: cysteineCheckbox.checked,
      sele: 'CYS',
      scale: 0.50
    })
    o.addRepresentation('surface', {
      name: 'cysteine_ajoene',
      visible: cysteine_ajoeneCheckbox.checked,
      sele: '[367 687 108]',
      scale: 0.50,
      colorScheme: "resname",
      background: true,
      contour: true
    })
    o.addRepresentation('surface', {
      name: 'cysteine_static',
      visible: cysteine_staticCheckbox.checked,
      sele: '[251 259 367 426]',
      scale: 0.50,
      colorScheme: "resname",
      background: true,
      contour: true
    })
    o.addRepresentation('spacefill', {
      name: 'waterIon',
      visible: waterIonCheckbox.checked,
      sele: 'water or ion',
      scale: 0.25
    })
  })
}

var loadStructureButton = createFileButton('load structure', {
  accept: '.pdb,.cif,.ent,.gz',
  onchange: function (e) {
    if (e.target.files[ 0 ]) {
      loadStructure(e.target.files[ 0 ])
    }
  }
}, { top: '12px', left: '12px' })
addElement(loadStructureButton)

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

var ligandCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
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
  onchange: function (e) {
    stage.getRepresentationsByName('cysteine_ajoene')
      .setVisibility(e.target.checked)
  }
}, { top: '108px', left: '12px' })
addElement(cysteine_ajoeneCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine_ajoene'
}, { top: '108px', left: '32px' }))

var cysteine_staticCheckbox = createElement('input', {
  type: 'checkbox',
  checked: true,
  onchange: function (e) {
    stage.getRepresentationsByName('cysteine_static')
      .setVisibility(e.target.checked)
  }
}, { top: '132px', left: '12px' })
addElement(cysteine_staticCheckbox)
addElement(createElement('span', {
  innerText: 'cysteine_static'
}, { top: '132px', left: '32px' }))

var waterIonCheckbox = createElement('input', {
  type: 'checkbox',
  checked: false,
  onchange: function (e) {
    stage.getRepresentationsByName('waterIon')
      .setVisibility(e.target.checked)
  }
}, { top: '156px', left: '12px' })
addElement(waterIonCheckbox)
addElement(createElement('span', {
  innerText: 'water+ion'
}, { top: '156px', left: '32px' }))

var centerButton = createElement('input', {
  type: 'button',
  value: 'center',
  onclick: function () {
    stage.autoView(1000)
  }
}, { top: '180px', left: '12px' })
addElement(centerButton)

//loadStructure('data://3SN6.cif')
loadStructure('rcsb://6QHD')
