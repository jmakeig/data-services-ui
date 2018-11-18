package com.acme;

import org.junit.Test;
import com.marklogic.DatabaseClient;
import com.marklogic.DatabaseClientFactory;

public class DataServiceTest {
  @Test
  public void testRuleDefinitions() {
    DatabaseClient client = DatabaseClientFactory.newClient("localhost", 8003, "username", "password",
        Authentication.DIGEST);
    // HelloWorld.on();
  }
}