// firstTest.spec.js --> a spec a test file egyezményes neve (this is a naming convention for the test files)
 /// <reference types="cypress"/>

describe('Our first suite', ()=> {
    it('First test', ()=>{

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()


        // Tag name
        cy.get('input')

        // ID
        cy.get('#inputEmail1')
        // class name
        cy.get('.input-full-width')

        //Attribute nam
        cy.get('[placeholder]')
        
        // Attribute name & value
        cy.get('[placeholder="Email"]')

        // Class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        // Tag name and Attribute value
        cy.get('input[placeholder="Email"]')

        // 2 diff attributes
        cy.get('input[placeholder="Email"][type="email"]')

        // Tag name, Attribute with value, ID, Class name
        cy.get('input#inputEmail1[placeholder="Email"].size-medium')

        // own selector (data set) - The most recommended way by Cypress
        cy.get('[data-cy="imputEmail1"]')
    })
    it('Second test', ()=> {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')

        cy.contains('Sign in') // first sign in button
        cy.contains('[status="warning"]','Sign in') //second Sign in button

        cy.get('#inputEmail3')
          .parents('form')
          .find('button')
          .should('contain', 'Sign in')
          .parents('form')
          .find('nb-checkbox')
          .click()
        
        cy.contains('nb-card', 'Horizontal form').find('[type="email"]')
    })
    it('then and wrap methods', ()=> {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        // cy.contains('nb-card','Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain', 'Email address')
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain', 'Password')

        //we want to use variables instead of duplicates.
        cy.contains('nb-card', 'Using the Grid').then(firstForm => {
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()
            expect(emailLabelFirst).to.equal('Email')
            expect(passwordLabelFirst).to.equal('Password')

            cy.contains('nb-card', 'Basic form').then(secondForm =>{
                const passwordSecondText = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(passwordSecondText).to.equal(passwordLabelFirst)

                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
        })
    });
    it('invoke command', () => {
            cy.visit('/')
            cy.contains('Forms').click()
            cy.contains('Form Layouts').click()
        //1 
        cy.get('[for="exampleInputEmail1"]')
            .should('contain', 'Email address')
            // more assertions
            .should('have.class', 'label')
            .and('have.text', 'Email address')
        //2 jquerry
        cy.get('[for="exampleInputEmail1"]').then(label => {
            expect(label.text()).to.equal('Email address')
            //more assertions
            expect(label).to.have.class('label')
            expect(label).to.have.text('Email address')

        })

        //3 cypress, +logic can be added
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })
        
        // checkbox checked?
        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
        .find('.custom-checkbox')
        .invoke('attr','class')
        //.should('contain', 'checked')
        .then(classValue => {
            expect(classValue).to.contain('checked')
        })
    });
    it('assert property', () => {

        function selectDayFromCurrent(day) {
           let date = new Date()
           date.setDate(date.getDate() + day)
            let futureDay = date.getDate()
            let futureMonth = date.toLocaleString('en-US', {month: 'short'})
            let dateAssert = futureMonth+' '+futureDay+', '+date.getFullYear()
            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then( dateAttribute =>{
                if(!dateAttribute.includes(futureMonth)){
                    cy.get('[data-name="chevron-right"]').click()
                    selectDayFromCurrent(day)
                } else{
                    cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
                }
            })
            console.log(futureDay+'\n'+futureMonth);
            return dateAssert
        }

        
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            //cy.get('nb-calendar-day-picker').contains('19').click()
            //cy.wrap(input).invoke('prop','value').should('contain', 'Jan 19, 2022')
            let dateAssert = selectDayFromCurrent(1)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
            cy.wrap(input).should('have.value', dateAssert)

        })

    });
    it('radio button', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click() 

        cy.contains('nb-card', 'Using the Grid')
            .find('[type="radio"]')
            .then(radioButtons => {
                cy.wrap(radioButtons)
                    .first()
                    .check({force: true})
                    .should('be.checked')

                cy.wrap(radioButtons)
                    .eq(1)
                    .check({force: true})

                cy.wrap(radioButtons)
                    .eq(0)
                    .should('not.be.checked')
                
                cy.wrap(radioButtons)
                    .eq(2)
                    .should('be.disabled')
            })
    });
    it('chechboxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click() 

        cy.get('[type="checkbox"]')
            .eq(0)
            .check({force: true})
        cy.get('[type="checkbox"]')
            .eq(1)
            .click({force: true})
        cy.get('[type="checkbox"]')
            .eq(2)
            .click({force: true})
        cy.get('[type="checkbox"]')
            .eq(2)
            .check({force: true})
    });

    it('dropdown, list', () => {
        cy.visit('/')
        
        //1
        // cy.get('nav nb-select').click()
        // cy.get('.options-list').contains('Dark').click()
        // cy.get('nav nb-select').should('contain', 'Dark')
        // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')

        //2 dropdownlist
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each( (listItem, index) =>{
                // list item text (" Light", " Dark"...)
                const itemText = listItem.text().trim()
                const colors = {
                    "Light":"rgb(255, 255, 255)",
                    "Dark":"rgb(34, 43, 69)",
                    "Cosmic":"rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }
                cy.wrap(listItem).click()
                cy.wrap(dropdown).should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])
                if(index < 3){
                    cy.wrap(dropdown).click()
                }

            })
        })
    });
    it('web tables', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click() 

        //1 edit data
        // cy.get('tbody').contains('tr', 'Larry').then( tableRow =>{
        //     cy.wrap(tableRow).find('.nb-edit').click()
        //     cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
        //     cy.wrap(tableRow).find('.nb-checkmark').click()
        //     cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        // })

        //2 new row
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then( tableRow =>{
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Soma')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Steger')
            cy.wrap(tableRow).find('[placeholder="Username"]').type('stuky')
            cy.wrap(tableRow).find('[placeholder="E-mail"]').type('stuky19@gmail.com')
            cy.wrap(tableRow).find('[placeholder="Age"]').type('26')
            cy.wrap(tableRow).find('[class="nb-checkmark"]').click()
        })
        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain','Soma')
            cy.wrap(tableColumns).eq(3).should('contain','Steger')
            cy.wrap(tableColumns).eq(4).should('contain','stuky')
            cy.wrap(tableColumns).eq(5).should('contain','stuky19@gmail.com')
            cy.wrap(tableColumns).eq(6).should('contain','26')
        })
        //3 filter by age
        const age = [20, 30, 40, 200]
        cy.wrap(age).each(age =>{
            cy.get('thead [placeholder="Age"]').clear().type(age)
            cy.wait(500)
            cy.get('tbody tr').each(tableRow=>{
                if(age === 200){
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })

    });
    it('tooltip', () => {
        //cypress runner, inpesct element -> tooltip text
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click() 

        cy.contains('nb-card', 'Colored Tooltips').contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')
    });      
    it('dialog box', () => {
        // window dialog box
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click() 
        //confirm or alert, depends on your app
        //1
        // cy.get('tbody tr').first().find('.nb-trash').click()
        // cy.on('window:confirm', (confirm) =>{
        //     expect(confirm).to.equal('Are you sure you want to delete?')
        // })
        // //2 confirm
        // const stub = cy.stub()
        // cy.on('window:confirm', stub)
        // cy.get('tbody tr').first().find('.nb-trash').click().then(()=> {
        //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        // })
        //3 cancel
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', ()=> false)
    });
    
})