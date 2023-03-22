
const inputSimulator = 
    ['Yuri Vaskoboinikov','Shoshi Battler','Avi Cohen','Ruth Stern'];

const customersDB = 
    [{name:'Ruth Stern',         pin:7890, amount: 2000},
     {name:'Yuri Vaskoboinikov', pin:1993, amount: 2500}, 
     {name:'Shoshi Battler',     pin:5432, amount: 1000},
     {name:'Avi Cohen',          pin:1234, amount: 1500}];

const menu = ["DEPOSITS", "WITHDRAWALS", "CHECK BALANCE",
              "PIN CODE", "RECIPE", "QUIT"];

function toggleOptions(onOff) 
{
  if (onOff === 1) 
  {
    for (let i = 0; i < 6; i++) 
    {
      document.querySelector(`#option${i + 1}`).innerText = menu[i];
    }
  } 
  else if (onOff === 0) 
  {
    for (let i = 0; i < 6; i++) 
    {
      document.querySelector(`#option${i + 1}`).innerText = "";
    }
  } else return;
}

function clining(innerHtml)
{
    symbol = '';
    if (typeof pin !== 'undefined') pin.value = '';    
    trusted = false;
    menuBuffer = "";

    document.querySelector('div#content').innerHTML = 
    `<h2>${innerHtml}</h2>`;
    
    var image = document.getElementById('image')
    card.style.animationName='example1';
}

function welcome()
{
    card.style.animationName='example';

    const index = Math.floor(Math.random() * inputSimulator.length);
    customer = inputSimulator[index].toUpperCase();

    document.querySelector('div#content').innerHTML = 
        `<h2>WELCOME, ${customer} !<br><br>PLEASE ENTER YOUR PIN.</h2>
        <input type=password id="pin" maxlength="4" readonly>`;
}

function setCookie(cname, cvalue, exdays) 
{
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

let customer = "";
document.querySelector('button.card').addEventListener('click', welcome);

let symbol = '';
let trusted = false;
let menuBuffer = "";
document.addEventListener('click', e => 
{    
    const pin = document.querySelector('#pin');

    let element = e.target;
    
    if (element.tagName == 'BUTTON' &&
        element.parentElement.className.includes("buttons"))
    { 
        //console.log(element.parentElement.className);
            
        symbol = element.innerText; 

        if(symbol.toLowerCase()==='cancel')
        {
            clining("INSERT YOUR CARD<br><br>BY CLICKING THE SLOT.");
            toggleOptions(0);

            return;
        }

        if(!!pin)
        {
            if(pin.value.length < 4)
            {
                if(!Number.isNaN(parseInt(symbol))) pin.value += symbol;
                else if(symbol==='←') pin.value = pin.value.slice(0,-1);
                else if(symbol==='→') pin.value += ' ';  
                
                //console.log(`${pin.value}`) ;     
            } 
            if(symbol.toLowerCase()==='clear') pin.value = '';
            else if(symbol.toLowerCase()==='enter')
            {
                //Go to DB and check:
                //console.log(customer);

                let rowDB = customersDB.filter(x=>x.name.toUpperCase()===customer)[0]; 

                if (!rowDB) 
                {
                    clining("PLEASE CONTACT THE BANK CLERK<br><br>TO CREATE YOUR ACCOUNT.");

                    return;
                }
                console.log(`pin.value=${pin.value}`);

                let pinCode = 0;

                //Cookie:
                let userKey = rowDB.name.replace(/\s+/g, '');

                if (document.cookie.split(";").some((item) => 
                item.trim().startsWith(`${userKey}=`)))
                {
                    pinCode = document.cookie
                            .split(";").find((row) => 
                            row.startsWith(`${userKey}=`))
                            ?.split("=")[1];

                    //console.log(`cookie pinCode=${pinCode}`);  

                    //setCookie(userKey, '', 0);

                }
                if(pin.value == pinCode) trusted = true;
                else if( pin.value == rowDB.pin) trusted = true;  
                else 
                {
                    clining("INSERT YOUR CARD<br><br>BY CLICKING THE SLOT.");
                    toggleOptions(0);

                    return;
                }                
                document.querySelector("div#content").innerHTML = 
                `<h2><b>ATM MENU</b><br><br>PRESS A BUTTON TO CHOOSE<br><br>YOUR OPTION:</h2>`;

                toggleOptions(1);
            }
        }
        else if(trusted)
        { 
            let rowDB = customersDB.filter(x=>x.name.toUpperCase()===customer)[0]; 

            if(!Number.isNaN(parseInt(symbol))) menuBuffer += symbol;
            else if(symbol==='←') menuBuffer = menuBuffer.slice(0,-1);
            else if(symbol.toLowerCase()==='clear')
            { 
                menuBuffer = "";
                toggleOptions(1);

                document.querySelector("div#content").innerHTML = 
                `<h2><b>ATM MENU</b><br><br>PRESS A BUTTON TO CHOOSE<br><br>YOUR OPTION:</h2>`;
            }
            else if(symbol.toLowerCase()==='enter')
            {
                //console.log(`menuBuffer is ${menuBuffer}`);

                if(menuBuffer[0] == 'D')
                {
                    let deposit = parseInt(menuBuffer.slice(1));
                    deposit = Number.isNaN(deposit) ? 0 : deposit;

                    let remainder = deposit % 20;
                    if(remainder>0)  remainder = deposit % 50 % 20;

                    console.log(`remainder=${remainder}`);

                    if(deposit===0 || remainder>0)
                    {
                        clining("INSERT YOUR CARD<br><br>BY CLICKING THE SLOT.");
                        toggleOptions(0);
    
                        return;
                    } 
                    rowDB.amount += deposit;                    

                    console.log(`rowDB.amount of ${rowDB.amount}`);

                    document.querySelector(`#option1`).innerText = "DEPOSITS";
                }
                else if(menuBuffer[0] == 'W')
                {
                    let withdrawal = parseInt(menuBuffer.slice(1));
                    withdrawal = Number.isNaN(withdrawal) ? 0 : withdrawal;
                    
                    if(withdrawal===0)
                    {
                        clining("INSERT YOUR CARD<br><br>BY CLICKING THE SLOT.");
                        toggleOptions(0);
    
                        return;
                    }

                    for(let i=1; i<4; i++)
                    {
                        withdrawal = (withdrawal===i) ? 50*i : withdrawal;
                    }
                    withdrawal = (withdrawal===4) ? 300 : withdrawal;

                    let remainder = rowDB.amount - withdrawal;
                    console.log(`remainder=${remainder}`);

                    if(remainder<0)
                    {
                        menuBuffer = 'W';

                        document.querySelector("div#content").innerHTML = 
                        `<h2>SORRY,<br><br>OPERATION COULD NOT HAPPEN<br><br>NOT ENOUGH BALANCE</h2>`;
                    } 
                    else
                    { 
                        rowDB.amount -= withdrawal;                    

                        console.log(`rowDB.amount of ${rowDB.amount}`);

                        document.querySelector(`#option2`).innerText = "WITHDRAWALS";

                        document.querySelector("div#content").innerHTML = 
                        `<h2><b>ATM MENU</b><br><br>PRESS A BUTTON TO CHOOSE<br><br>YOUR OPTION:</h2>`;
                    }
                }
                else if(menuBuffer[0] == 'P')
                {
                    let pinCode = parseInt(menuBuffer.slice(1));
                    pinCode = Number.isNaN(pinCode) ? 0 : pinCode;
                    
                    if(pinCode===0)
                    {
                        clining("INSERT YOUR CARD<br><br>BY CLICKING THE SLOT.");
                        toggleOptions(0);
    
                        return;
                    }
                    if(pinCode.toString().length > 4)  pinCode=pinCode.toString().slice(0,4);

                    let userKey = rowDB.name.replace(/\s+/g, '');

                    console.log(`userKey=${userKey} ,pinCode=${pinCode}`);

                    setCookie(userKey, pinCode, 60) ;

                    document.querySelector(`#option4`).innerText = "PIN CODE";
                }
            }            
        }
    }
    else if(element.tagName == 'BUTTON' &&
           (element.parentElement.className.includes("but1") ||
            element.parentElement.className.includes("but2") ))
    {
        if(trusted)
        {
            //console.log(`trusted=${trusted}`);

            let rowDB = customersDB.filter(x=>x.name.toUpperCase()===customer)[0];

            symbol = element.innerText; 
            if(symbol.toUpperCase() == 'D')
            {
                menuBuffer = 'D';
                document.querySelector(`#option1`).innerText =
                "enter your deposit amount and press Enter button";
            }
            else if(symbol.toUpperCase() == 'R')
            {  
                document.querySelector('div#content').innerHTML = 
                `<h2>HELLO <b>${rowDB.name.toUpperCase()}</b> !<br><br>
                AT THIS MOMENT ${new Date().toLocaleString()}<br><br>
                YOU GOT <b>${rowDB.amount}</b> ₪ IN YOUR ACCOUNT.<br><br>
                PRESS Clear KEY TO REMOVE.<br><br>
                THANK YOU FOR USING <b>ATM.</b></h2>`;
            }
            else if(symbol.toUpperCase() == 'W')
            {
                menuBuffer = 'W';
                document.querySelector(`#option2`).innerText =
                `1 - 50₪, 2 - 100₪, 3 - 150₪, 4 - 300₪ 
                or enter other amount. after press Enter key.`;
            }
            else if(symbol.toUpperCase() == 'C')
            {
                document.querySelector('div#content').innerHTML = 
                `<h2>YOU CURRENT BALANCE IS<br><br>
                <b>${rowDB.amount}</b> ₪ .<br><br>
                PRESS Clear KEY TO REMOVE.</h2>`;
            }
            else if(symbol.toUpperCase() == 'Q')
            {
                document.querySelector('div#content').innerHTML = 
                `<h2>GOODBY,<br><br>
                HAVE A NICE DAY.<br><br>
                PRESS Cancel KEY TO GET YOUR CARD.</h2>`;
            }
            else if(symbol.toUpperCase() == 'P')
            {
                menuBuffer = 'P';
                document.querySelector(`#option4`).innerText =
                "enter new pin and press Enter button";
            }
        }
    }                
})


// function welcome(){
    
//     console.log(cust.Name, cust.pin)
//     //var image = document.getElementById('image')    
//     card.style.animationName='example';


//     content.innerHTML ='<form><h2>WELCOME, ' + cust.Name + 
//     '<br> PLEASE ENTER YOUR PIN.</h2><input id="number" type=number max="9999">'
    
// };

// welcome()