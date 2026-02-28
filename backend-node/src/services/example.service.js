/**
 * Example service - demonstrates the service layer pattern
 * Add your business logic here
 */

class ExampleService {
  /**
   * Example method
   */
  async processData(data) {
    // Add your business logic here
    return {
      processed: true,
      data
    };
  }
}

module.exports = new ExampleService();
