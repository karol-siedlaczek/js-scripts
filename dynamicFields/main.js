$("form :input").change(function() {
	let elem = $(this)
  let childs = elem.attr('childs').split(" ").map(String)
  for (let i in childs) {
  	addChildInput(elem, childs[i])
  }
});

function addChildInput(elem, childName) {
	let inputList = [
  	{
    	"name": "test1",
      "value": `
      	<fieldset data-value>
        <labelInne pole</label>
        <div class="field">
          <input type="radio" id="age1" name="age" value="30" childs="test1 test2">
          <label for="age1">0 - 30</label>
        </div>
        <div class="field">
          <input type="radio" id="age2" name="age" value="60" childs="test3 test4">
          <label for="age2">31 - 60</label>
        </div>
        <div class="field">
          <input type="radio" id="age3" name="age" value="100" childs="test5 test6">
          <label for="age3">61 - 100</label>
        </div>
        </fieldset>
      `
    },
    {
    	"name": "test3",
      "value": "test"
    }
  ]
  let elemToAdd = inputList.find(elemToAdd => elemToAdd.name === childName)
  if (elemToAdd) {
  	elem.parents('fieldset').after(elemToAdd['value'])
  	console.log(elemToAdd['value'])
  }
  else
  	console.log(`child ${childName} not found`)
}

