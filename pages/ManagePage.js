const logger = require('../entity/Logger.js').logger;
const key = require('selenium-webdriver').Key;
const By = require('selenium-webdriver/lib/by').By;
const Page = require('./Page.js').Page;
const buttonOk = By.xpath("/html/body/div[2]/div/div[3]/button[1]");
const modal = By.className("modal");
const Utils = require('../utils/Utils.js').Utils;
const adj = "";

const buttonFinalize = By.xpath("//*[contains(text(),'Finalize Crowdsale')]");
const buttonYesFinalize = By.className("swal2-confirm swal2-styled");
const buttonSave = By.className("no_arrow button button_fill");

const warningEndTimeTier1 = By.xpath("//*[@id=\"root\"]/div/" + adj + "section/div[3]/div/div[2]/div[2]/div[2]/p[2]");
const warningEndTimeTier2 = By.xpath("//*[@id=\"root\"]/div/" + adj + "section/div[4]/div/div[1]/div[2]/div[2]/p[2]");
const warningStartTimeTier2 = By.xpath("//*[@id=\"root\"]/div/" + adj + "section/div[4]/div/div[1]/div[2]/div[1]/p[2]");
const warningStartTimeTier1 = By.xpath("//*[@id=\"root\"]/div/" + adj + "section/div[4]/div/div[2]/div[2]/div[1]/p[2]");

const reservedTokensInnerContainer = By.className("reserved-tokens-item-container-inner monospace");
const fieldsReservedTokensAddress = By.className("reserved-tokens-item reserved-tokens-item-left");

const whitelistContainer = By.className("white-list-container");
const whitelistContainerInner = By.className("white-list-item-container-inner");
const whitelistContainerNoStyle = By.className("white-list-item-container no-style");
const fieldWhitelistAddressAdded = By.className("white-list-item white-list-item-left");

class ManagePage extends Page {

	constructor(driver, crowdsale) {
		super(driver);
		this.URL;
		this.name = "Manage page: ";
		this.crowdsale = crowdsale;
		this.fieldNameTier = [];
		this.fieldWalletAddressTier = [];
		this.fieldStartTimeTier = [];
		this.fieldEndTimeTier = [];
		this.fieldRateTier = [];
		this.fieldSupplyTier = [];
		this.fieldWhAddressTier = [];
		this.fieldMinTier = [];
		this.fieldMaxTier = [];
		this.buttonAddWh = [];
		this.buttonFinalize;
		this.buttonSave;
		this.fieldWhAddress = [];
		this.fieldWhMin = [];
		this.fieldWhMax = [];

	}

	async initWhitelistFields() {
		logger.info(this.name + "initWhitelistFields ");
		try {
			let arrayWh = await this.findWithWait(whitelistContainer);
			if (arrayWh === null) return null;
			let array;
			for (let i = 0; i < arrayWh.length; i++) {
				array = await this.getChildFromElementByClassName("input", arrayWh[i]);
				if (array !== null) {
					this.fieldWhAddress[i] = array[0];
					this.fieldWhMin[i] = array[1];
					this.fieldWhMax[i] = array[2];
				}
			}
			return arrayWh;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

	async initButtonSave() {
		logger.info(this.name + "initButtonSave ");
		try {
			let locator = By.className("no_arrow");
			let array = await super.findWithWait(locator);
			this.buttonSave = array [0];
			return array;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

	async initButtonFinalize() {
		logger.info(this.name + "initButtonFinalize ");
		try {
			let locator = By.className("button");
			let array = await super.findWithWait(locator);
			this.buttonFinalize = array [0];
			return array;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

	async initButtons() {
		logger.info(this.name + "initButtons ");
		try {
			let locator = By.className("button button_fill button_fill_plus");
			let array = await super.findWithWait(locator);
			for (let i = 0; i < array.length; i++)
				this.buttonAddWh[i] = array[i];
			return array;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

	async initInputs() {
		logger.info(this.name + "initInputs ");
		try {
			let locator = By.className("input");
			let array = await super.findWithWait(locator);
			let amountTiers = 1;
			let tierLength = 6;

			if (array.length > 9) {
				amountTiers = 2;
			}
			if ((array.length > 15) || (array.length == 9)) tierLength = 9;
			for (let i = 0; i < amountTiers; i++) {
				this.fieldNameTier[i] = array[i * tierLength + 0];
				this.fieldWalletAddressTier[i] = array[i * tierLength + 1];
				this.fieldStartTimeTier[i] = array[i * tierLength + 2];
				this.fieldEndTimeTier[i] = array[i * tierLength + 3];
				this.fieldRateTier[i] = array[i * tierLength + 4];
				this.fieldSupplyTier[i] = array[i * tierLength + 5];
				this.fieldWhAddressTier[i] = undefined;
				this.fieldMinTier[i] = undefined;
				this.fieldMaxTier[i] = undefined;

				if ((tierLength == 9) || (tierLength == 18)) {
					this.fieldWhAddressTier[i] = array[i * tierLength + 6];
					this.fieldMinTier[i] = array[i * tierLength + 7];
					this.fieldMaxTier[i] = array[i * tierLength + 8];
				}
			}

			if (array.length == 15) {
				this.fieldWhAddressTier[1] = array[12];
				this.fieldMinTier[1] = array[13];
				this.fieldMaxTier[1] = array[14];
			}
			return array;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

	async getNameTier(tier) {
		logger.info(this.name + "getNameTier ");
		if (await this.initInputs() === null) return "";
		else
			return await super.getAttribute(this.fieldNameTier[tier - 1], "value");
	}

	async isDisabledNameTier(tier) {
		logger.info(this.name + "isDisabledNameTier ");
		return (await this.initInputs() !== null)
			&& await this.isElementDisabled(this.fieldNameTier[tier - 1]);
	}

	async getWalletAddressTier(tier) {
		logger.info(this.name + "getWalletAddressTier ");
		if (await this.initInputs() === null) return null;
		else
			return await super.getAttribute(this.fieldWalletAddressTier[tier - 1], "value");
	}

	async isDisabledWalletAddressTier(tier) {
		logger.info(this.name + "isDisabledWalletAddressTier ");
		if (await this.initInputs() === null) return null;
		else
			return await this.isElementDisabled(this.fieldWalletAddressTier[tier - 1]);
	}

	async isDisabledEndTime(tier) {
		logger.info(this.name + "isDisabledEndTime ");
		if (await this.initInputs() === null) return null;
		else
			return await this.isElementDisabled(this.fieldEndTimeTier[tier - 1]);
	}

	async getRateTier(tier) {
		logger.info(this.name + "getRateTier ");
		if (await this.initInputs() === null) return null;
		else
			return await super.getAttribute(this.fieldRateTier[tier - 1], "value");
	}

	async getSupplyTier(tier) {
		logger.info(this.name + "getSupplyTier ");
		if (await this.initInputs() === null) return null;
		else
			return await super.getAttribute(this.fieldSupplyTier[tier - 1], "value");
	}

	async getStartTimeTier(tier) {
		logger.info(this.name + "getStartTimeTier ");
		let field = await this.getFieldStartTime(tier);
		return await super.getAttribute(field, "value");
	}

	async getFieldStartTime(tier) {
		logger.info(this.name + "getFieldStartTime ");
		const locator = By.id("tiers[" + (tier - 1) + "].startTime");
		return await super.getElement(locator);
	}

	async getEndTimeTier(tier) {
		logger.info(this.name + "getEndTimeTier ");
		if (await this.initInputs() === null) return null;
		else return await super.getAttribute(this.fieldEndTimeTier[tier - 1], "value");
	}

	async clickButtonSave() {
		logger.info(this.name + "clickButtonSave ");
		return (await this.initButtonSave() !== null)
			&& await super.clickWithWait(this.buttonSave);
	}

	async isDisabledButtonSave() {
		logger.info(this.name + " isDisabledButtonSave ");
		await this.initButtonSave();
		if (await super.getAttribute(this.buttonSave, "class") === "no_arrow button button_fill button_disabled") {
			logger.info("present and disabled");
			return true;
		}
		else {
			logger.info("Error " + err);
			return false;
		}
	}

	async isPresentWarningStartTimeTier1() {
		logger.info(this.name + "isPresentWarningStartTimeTier1 ");
		try {
			logger.info(this.name + "red warning if data wrong :");
			let result = await super.getTextForElement(warningStartTimeTier1, 1);
			logger.info("Text=" + result);
			return (result !== "");
		}
		catch (err) {
			logger.info(err);
			return false;
		}
	}

	async isPresentWarningStartTimeTier2() {
		logger.info(this.name + "isPresentWarningStartTimeTier2 ");
		try {
			logger.info(this.name + "red warning if data wrong :");
			await this.driver.sleep(1000);
			let result = await super.getTextForElement(warningStartTimeTier2, 1);
			logger.info("Text=" + result);
			return (result !== "");
		}
		catch (err) {
			logger.info(err);
			return false;
		}
	}

	async isPresentWarningEndTimeTier2() {

		logger.info(this.name + "isPresentWarningEndTimeTier2 ");
		return false;
		await this.driver.sleep(1000);
		let result = await super.getTextForElement(warningEndTimeTier2, 1);
		logger.info("Text=" + result);
		return (result !== "");
	}

	async isPresentWarningEndTimeTier1() {
		logger.info(this.name + "red warning if data wrong :");
		return false;
		await this.driver.sleep(500);
		let result = await super.getTextForElement(warningEndTimeTier1, 1);
		logger.info("Text=" + result);
		return (result !== "");
	}

	async fillWhitelist(tier, address, min, max) {
		logger.info(this.name + "fillWhitelist  ");
		return (await this.initWhitelistFields() !== null)
			&& await super.fillWithWait(this.fieldWhAddress[tier - 1], address)
			&& await super.fillWithWait(this.fieldWhMin[tier - 1], min)
			&& await super.fillWithWait(this.fieldWhMax[tier - 1], max)
			&& (await this.initButtons() !== null)
			&& await super.clickWithWait(this.buttonAddWh[tier - 1])
			&& await this.clickButtonSave();
	}

	async fillEndTimeTier(tier, date, time) {
		logger.info(this.name + " fill end time, tier #" + tier + ":");
		const action = this.driver.actions();
		if (date === "") return true;
		let format = await Utils.getDateFormat(this.driver);
		if (!date.includes("/")) {
			time = Utils.getTimeWithAdjust(parseInt(time), format);
			date = Utils.getDateWithAdjust(parseInt(date), format);
		}
		return (await this.initInputs() !== null)
			&& !await this.isElementDisabled(this.fieldEndTimeTier[tier - 1])
			&& await super.fillWithWait(this.fieldEndTimeTier[tier - 1], date)
			&& (await action.sendKeys(key.TAB).perform() !== null)
			&& await super.fillWithWait(this.fieldEndTimeTier[tier - 1], time);
	}

	async fillStartTimeTier(tier, date, time) {
		await this.initInputs();
		logger.info(this.name + "fill start time,tier #" + tier + ":");
		if (await this.isElementDisabled(this.fieldStartTimeTier[tier - 1]))
			return false;
		await super.fillWithWait(this.fieldStartTimeTier[tier - 1], date);
		const action = this.driver.actions();
		await action.sendKeys(key.TAB).perform();
		await super.fillWithWait(this.fieldStartTimeTier[tier - 1], time);
		return true;
	}

	async fillRateTier(tier, rate) {
		await this.initInputs();
		logger.info(this.name + "fill Rate,tier #" + tier + ":");
		await super.clearField(this.fieldRateTier[tier - 1]);
		await super.fillWithWait(this.fieldRateTier[tier - 1], rate);
	}

	async fillSupplyTier(tier, rate) {
		await this.initInputs();
		logger.info(this.name + "fill Supply,tier #" + tier + ":");
		await super.clearField(this.fieldSupplyTier[tier - 1]);
		await super.fillWithWait(this.fieldSupplyTier[tier - 1], rate);
	}

	async open() {
		logger.info(this.name + ": open  " + this.URL);
		return await super.open(this.URL);
	}

	async isEnabledButtonFinalize() {
		logger.info(this.name + " isEnabledButtonFinalize ");
		await this.initButtonFinalize();
		if (await super.getAttribute(this.buttonFinalize, "class") === "button button_fill") {
			logger.info("present and enabled");
			return true;
		}
		else {
			logger.info("present and disabled");
			return false;
		}
	}

	async clickButtonFinalize() {
		logger.info(this.name + " clickButtonFinalize ");
		return (await this.initButtonFinalize() !== null)
			&& super.clickWithWait(this.buttonFinalize);
	}

	async clickButtonYesFinalize() {
		logger.info(this.name + "clickButtonYesFinalize ");
		return await super.clickWithWait(buttonYesFinalize);
	}

	async isPresentPopupYesFinalize() {
		logger.info(this.name + "confirm Finalize/Yes :");
		return await super.isElementDisplayed(buttonYesFinalize);
	}

	async waitUntilShowUpPopupFinalize(Twaiting) {
		logger.info(this.name + "waitUntilShowUpPopupFinalize ");
		return super.waitUntilDisplayed(buttonYesFinalize, Twaiting);
	}

	async waitUntilShowUpPopupConfirm(Twaiting) {
		logger.info(this.name + "waitUntilShowUpPopupConfirm ");
		return super.waitUntilDisplayed(buttonOk, Twaiting);
	}

	async isPresentButtonOK() {
		logger.info(this.name + "button OK :");
		return await super.isElementDisplayed(buttonOk);
	}

	async clickButtonOK() {
		logger.info(this.name + "button OK :");
		return await super.clickWithWait(buttonOk);
	}

	async getReservedTokensAddresses() {
		logger.info(this.name + "getReservedTokensAddresses ");
		try {
			let array = await this.findWithWait(fieldsReservedTokensAddress, 180)
			if (array === null) return null;
			let addresses = [];
			for (let i = 0; i < array.length - 1; i++) {
				addresses[i] = await super.getTextForElement(array[i + 1]);
				logger.info("address: " + addresses[i]);
			}
			return addresses;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

	async getWhitelistAddresses(tierNumber) {
		logger.info(this.name + "getWhitelistAddresses ");
		try {

			let elements = await super.findWithWait(whitelistContainer);
			let element = elements[tierNumber-1];
			console.log("elements="+elements.length);
			let array = await super.getChildFromElementByClassName(whitelistContainerInner, element);
			//let array = await super.findWithWait(whitelistContainerInner);
			console.log("AAAAAA="+array.length);
			if (array === null) return null;
			let addresses = [];
			for (let i = 0; i < array.length - 1; i++) {
				addresses[i] = await super.getTextForElement(array[i + 1]);
				logger.info("address: " + addresses[i]);
			}
			return addresses;
		}
		catch (err) {
			logger.info("Error: " + err);
			return null;
		}
	}

}

module
	.exports = {
	ManagePage: ManagePage
}