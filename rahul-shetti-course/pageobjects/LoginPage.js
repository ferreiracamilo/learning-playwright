class LoginPage{
    constructor(page){
        // this.page = page; This would work for embedding a go to action for example
        this.signInButton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async validLogin(username,password){
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
    }
}

module.exports = {LoginPage}