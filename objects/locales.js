import { get } from 'lodash'

const locales = {
  "en-us": {
    "resultNote": "The distribution will be changed by the number of purchase, but the result will not be affected."
  }
}

export default function(lang) {
  return get(locales, lang, 'en-us')
}
