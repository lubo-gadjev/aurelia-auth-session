/**
 * Created by moshensky on 6/17/15.
 */
export class Locale{
  constructor(defaults, data)
  {
    this.defaults = defaults;
    this.currentLocale = data;
  }

  getValueFor(identifier, category) {
    if (this.currentLocale && this.currentLocale[category]) {
      var currentLocaleSetting = this.currentLocale[category][identifier];
      if (currentLocaleSetting !== undefined && currentLocaleSetting !== null)
        return currentLocaleSetting;
    }
    if (this.defaults[category]) {
      var defaultSetting = this.defaults[category][identifier];
      if (defaultSetting !== undefined && defaultSetting !== null)
        return defaultSetting;
    }
    throw 'validation: I18N: Could not find: ' + identifier + ' in category: ' + category;
  }

  setting(settingIdentifier) {
    return this.getValueFor(settingIdentifier, 'settings');
  }

  translate(translationIdentifier, newValue, threshold) {
    var translation = this.getValueFor(translationIdentifier, 'messages');
    if (typeof translation === 'function') {
      return translation(newValue, threshold);
    }
    if (typeof translation === 'string') {
      return translation;
    }
    throw 'Validation message for ' + translationIdentifier + 'was in an unsupported format';
  }
}

class LocaleRepository  {
  constructor(){
    this.default = null;
    this.instances = new Map();
    this.defaults = {
      settings: {},
      messages: {}
    };
  }

  load(localeIdentifier, basePath) {
    if(!basePath) basePath = 'aurelia-custom-app-common-files/resources/';

    return new Promise((resolve, reject) => {
      if(this.instances.has(localeIdentifier)) {
        let locale = this.instances.get(localeIdentifier);
        resolve(locale);
      } else {
        System.import(basePath + localeIdentifier).then((resource) => {
          let locale = this.addLocale(localeIdentifier, resource.data);
          resolve(locale);
        });
      }
    });
  }

  addLocale(localeIdentifier, data)
  {
    var instance = new Locale(this.defaults, data);
    this.instances.set(localeIdentifier, instance);
    if(this.default === null)
      this.default = instance;
    return instance;
  }
}

Locale.Repository = new LocaleRepository();
