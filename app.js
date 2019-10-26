//helper functions
var format = function(n) {
  let subStrs = n.split(".");
  let cents = subStrs[1];
  let chars = subStrs[0].split("");
  chars = chars.reverse();
  let newChars = [];
  if (n.length > 3) {
    for (let i = 0; i < chars.length; i++) {
      if ((i % 3 === 0) && (i !== 0)) {
        newChars.push(",");
      }
      newChars.push(chars[i]);
    }
    if (newChars[0] === ",") {
      newChars.shift();
    }
    newChars = newChars.reverse();
    let newStr = "";
    for (let i = 0; i < newChars.length; i++) {
      newStr += newChars[i];
    }
    if (cents) {
      newStr += "." + cents;
    } else {
      newStr += ".00";
    }


    return newStr;
  }

  return n;
}


var budgetController = (function() {
  // Data types for expenses and incomes
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = (Math.round((this.value / totalIncome) * 100));
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    allTotals: {
      exp: 0,
      inc: 0
    },
    budget: 0,

    percentage: -1
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum = sum + current.value;
    })
    data.allTotals[type] = sum;
  }

  return {
    addItem: function(type, desc, val) {
      var newItem, ID;

      //ID = lastID + 1
      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new Item based on inc or exp type
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      //Add in the new item
      data.allItems[type].push(newItem);

      //return the new Element
      return newItem;
    },

    calculateBudget: function() {
      var budget, percent;
      //calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate budget: inc - exp
      data.budget = data.allTotals.inc - data.allTotals.exp;

      //calculate the percentage of income that we spent
      if (data.allTotals.inc > 0) {
        data.percentage = Math.floor((data.allTotals.exp / data.allTotals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.allTotals.inc,
        totalExp: data.allTotals.exp,
        percentage: data.percentage
      }
    },

    deleteItem: function(type, id) {
      var ids, index;

      // id = 3
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculatePercentages: function() {
      var total;
      total = data.allTotals.inc;
      data.allItems.exp.forEach(function(current) {
        current.calcPercentage(total);
      });
    },

    getPercentages: function() {
      var allPercs = data.allItems.exp.map(function(current) {
        return current.getPercentage();
      });
      return allPercs;
    },

    testing: function() {
      console.log(data);
    }

  };
})();

var UIController = (function() {
  // Class names
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    outputIncList: '.income__list',
    outputExpList: '.expenses__list',
    budgetIncome: '.budget__income--value',
    budgetExpenses: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    budgetLabel: '.budget__value',
    itemPercentage: '.item__percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    monthLabel: '.budget__title--month',
  }

  return {
    //Getting the input from the input areas UI
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be 'inc' or 'exp'
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },

    // adding an item to the list ui
    addListItem: function(obj, type) {
      var html, newHtml;
      //create HTML string with placeholder text
      if (type === 'inc') {
        html = `
        <div class="item clearfix" id="inc-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
                <div class="item__value">+ $%value%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>
        `
      } else if (type === 'exp') {
        html = `
          <div class="item clearfix" id="exp-%id%">
              <div class="item__description">%description%</div>
              <div class="right clearfix">
                  <div class="item__value">- $%value%</div>
                  <div class="item__percentage">21%</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>
          `
      }

      //replace placeholder text with actual Data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //insert HTML into the DOM
      if (type === 'inc') {
        document.querySelector(DOMStrings.outputIncList).insertAdjacentHTML('beforeend', newHtml);
      }
      if (type === 'exp') {
        document.querySelector(DOMStrings.outputExpList).insertAdjacentHTML('beforeend', newHtml);
      }
    },

    deleteListItem: function(id) {
      var element = document.getElementById(id);
      element.parentNode.removeChild(element);
    },

    //Accessing the DOM strings
    getDOMStrings: function() {
      return DOMStrings;
    },

    //clearing the fields
    clearFields: function() {
      var fields, fieldsArray;
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = "";
      })
      fieldsArray[0].focus();
    },

    displayBudget: function(obj) {

      document.querySelector(DOMStrings.budgetLabel).textContent = '$' + format(obj.budget.toString());
      document.querySelector(DOMStrings.budgetIncome).textContent = '+ ' + format(obj.totalInc.toString());
      document.querySelector(DOMStrings.budgetExpenses).textContent = '- ' + format(obj.totalExp.toString());


      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percs) {
      var fields;
      fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percs[index] > 0) {
          current.textContent = percs[index] + '%';
        } else {
          current.textContent = '---';
        }

      });
    },

    displayDate: function() {
      var date, monthList;
      date = new Date();
      monthList = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      document.querySelector(DOMStrings.monthLabel).textContent = monthList[date.getMonth()];
    }
  }
})();

var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    //Event listeners
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if (event.keycode === 13 || event.which == 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function() {
    var budget;
    // calculate budget
    budgetCtrl.calculateBudget();

    // return the budget
    budget = budgetCtrl.getBudget();

    // Update UI
    UIController.displayBudget(budget);
  };

  var updatePercentages = function() {
    //Calculate percentages
    budgetCtrl.calculatePercentages();

    //Read percentages from budget controller
    var percs = budgetCtrl.getPercentages();

    //update the UI with the new percentages
    UICtrl.displayPercentages(percs);
  };

  //functions
  var ctrlAddItem = function() {
    var input, newItem;

    // Get input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // Add new item to data structute
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // Add new item to UI
      UICtrl.addListItem(newItem, input.type);

      //clear the fields
      UICtrl.clearFields();

      //Calculate and update budget
      updateBudget();

      //calculate and update Percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //split id to elements
      splitID = itemID.split('-');

      //decide which type it is
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      //2. delete the item from the UI
      UICtrl.deleteListItem(itemID);

      //3. update and show the new totals
      updateBudget();

      //calculate and update Percentages
      upadtePercentages();
    }
  };


  return {
    init: function() {
      setupEventListeners();
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    },
  }


})(budgetController, UIController);

controller.init();

//test
