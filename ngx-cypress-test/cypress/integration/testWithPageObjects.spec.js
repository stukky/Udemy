import { navigateTo } from "../support/page_objects/navigationPage";
import { onFormLayoutPage } from "../support/page_objects/formLayoutsPage";
import { onDatePickerPage } from "../support/page_objects/datepickerPage";
import { onSmartTablePage } from "../support/page_objects/smartTable";


describe('Test with Page Objects', ()=> {
    beforeEach('open application', ()=>{
        cy.openHomePage()
    })
    it('verify navigations across the pages', () => {
        navigateTo.formLayoutPage()
        navigateTo.datePickerPage()
        navigateTo.toasterPage()
        navigateTo.smartTablesPage()
        navigateTo.tooltipPage()
    });
    it('should submit Inline and Basic form and select tomorrow date in calendat', () => {
        navigateTo.formLayoutPage()
        onFormLayoutPage.submitInlineFormWithNameAndEmail('Soma', 'steger.soma@nwmgroup.hu')
        onFormLayoutPage.submitBasicFormWithEmailAndPassword('steger.soma@nwmgroup.hu', 'Teszt012')
        navigateTo.datePickerPage()
        onDatePickerPage.selectCommonDatepickerDateFromToday(1)
        onDatePickerPage.selectDatepickerWithRangeFromToday(1,4)
        navigateTo.smartTablesPage()
        onSmartTablePage.addNewRecord('Soma','Steger', 'stuky', 'steger.soma@nwmgroup.hu','11')
        onSmartTablePage.updateAgeByFirstName('Soma', '26')
        onSmartTablePage.deleteRowByIndex(4)
    });
})