package controllers;

import play.mvc.*;
import play.db.jpa.JPAApi;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.List;

public class DbConsoleController extends Controller {
    
    private final JPAApi jpaApi;
    
    @Inject
    public DbConsoleController(JPAApi jpaApi) {
        this.jpaApi = jpaApi;
    }
    
    public Result console() {
        return ok(views.html.dbconsole.render());
    }
    
    public Result query(Http.Request request) {
        String sql = request.body().asFormUrlEncoded().get("sql")[0];
        
        try {
            return jpaApi.withTransaction(em -> {
                if (sql.trim().toUpperCase().startsWith("SELECT") || 
                    sql.trim().toUpperCase().startsWith("SHOW")) {
                    
                    List<?> results = em.createNativeQuery(sql).getResultList();
                    StringBuilder result = new StringBuilder();
                    
                    if (results.isEmpty()) {
                        return ok("<p>No results found.</p>").as("text/html");
                    }
                    
                    result.append("<table border='1' style='border-collapse: collapse; width: 100%;'>");
                    
                    // Check if results are arrays (multiple columns)
                    if (results.get(0) instanceof Object[]) {
                        Object[] firstRow = (Object[]) results.get(0);
                        
                        // Data rows
                        for (Object row : results) {
                            result.append("<tr>");
                            Object[] cols = (Object[]) row;
                            for (Object col : cols) {
                                result.append("<td style='padding: 10px;'>")
                                      .append(col != null ? col.toString() : "NULL")
                                      .append("</td>");
                            }
                            result.append("</tr>");
                        }
                    } else {
                        // Single column results
                        for (Object row : results) {
                            result.append("<tr><td style='padding: 10px;'>")
                                  .append(row != null ? row.toString() : "NULL")
                                  .append("</td></tr>");
                        }
                    }
                    
                    result.append("</table>");
                    return ok(result.toString()).as("text/html");
                    
                } else {
                    // For INSERT, UPDATE, DELETE
                    int rowsAffected = em.createNativeQuery(sql).executeUpdate();
                    return ok("Query executed successfully. Rows affected: " + rowsAffected);
                }
            });
            
        } catch (Exception e) {
            return badRequest("Error: " + e.getMessage());
        }
    }
}
