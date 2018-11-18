package com.acme;

import com.marklogic.client.DatabaseClient;
import com.marklogic.client.DatabaseClientFactory;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class DataServiceTest {
  @Test
  public void testRuleDefinitions() {
    DatabaseClient db = DatabaseClientFactory.newClient("localhost", 8099,
        new DatabaseClientFactory.DigestAuthContext("admin", "admin"));
    assertEquals("Hey! Hey!", HelloWorld.on(db).whatsUp("Hey!", 2L));
  }
}