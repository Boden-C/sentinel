/**
 * Represents the generated data for energy usage, emissions, and related actions.
 * @class GeneratedData
 */
export class GeneratedData {
    /**
     * Creates an instance of GeneratedData from a JSON object.
     * @param {Object} data - The input data to construct the GeneratedData object.
     * @param {string} data.estimatedCarbonEmmissions - The estimated carbon emissions (low, medium, or high).
     * @param {number} data.estimatedEnergyUse - The estimated energy use in numeric value.
     * @param {string} data.estimatedEnergyUsage - The estimated energy usage description.
     * @param {Array<Object>} data.actions - A list of actions to reduce carbon emissions or energy consumption.
     * @param {Array<Object>} data.tips - A list of energy-saving tips based on the context.
     */
    constructor(data) {
      /**
       * @type {string}
       */
      this.estimatedCarbonEmmissions = data.estimatedCarbonEmmissions;
  
      /**
       * @type {number}
       */
      this.estimatedEnergyUse = data.estimatedEnergyUse;
  
      /**
       * @type {string}
       */
      this.estimatedEnergyUsage = data.estimatedEnergyUsage;
  
      /**
       * @type {Array<InfoData>}
       */
      this.actions = data.actions.map(action => new InfoData(action));
  
      /**
       * @type {Array<InfoData>}
       */
      this.tips = data.tips.map(tip => new InfoData(tip));
    }
  }
  
  /**
   * Represents an individual action or tip with structured information.
   * @class InfoData
   */
  class InfoData {
    /**
     * Creates an instance of InfoData.
     * @param {Object} data - The input data to construct the InfoData object.
     * @param {string} data.title - The title of the action or tip (should be less than 6 words).
     * @param {string} data.description - A description of the action or tip.
     * @param {string} data.impact - The impact statement, emphasizing renewability and energy.
     * @param {string} data.request - A string that mimics an API request (a suggestion for the user).
     */
    constructor(data) {
      /**
       * @type {string}
       */
      this.title = data.title;
  
      /**
       * @type {string}
       */
      this.description = data.description;
  
      /**
       * @type {string}
       */
      this.impact = data.impact;
  
      /**
       * @type {string}
       */
      this.request = data.request;
    }
  }
  