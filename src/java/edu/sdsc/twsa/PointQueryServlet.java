
package edu.sdsc.twsa;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import org.json.JSONObject;

/**
 *
 * @author kailin
 */
public class PointQueryServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        StringBuilder sb = new StringBuilder();
        String line = null;
        BufferedReader reader = request.getReader();
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        System.out.println(sb);

        JSONObject obj = new JSONObject(sb.toString());
        String time = obj.getString("time").split("T")[0];
        String target = obj.getString("target").substring(15);
        Double lon = (Double) obj.getJSONArray("lonlat").get(0);
        Double lat = (Double) obj.getJSONArray("lonlat").get(1);

        String sql
                = "SELECT latitude, longitude, day, " + target + ", reg_id, reg_name \n"
                + "  FROM water_data \n"
                + " WHERE ST_Contains(grid,ST_GeomFromText('POINT("
                + lon + " " + lat + ")', 4326)) \n"
                + "   AND abs(day - date '" + time + "') <=3 \n"
                + "   AND latitude < " + (lat + 1) + "\n" 
                + "   AND latitude > " + (lat - 1) + "\n" 
                + "   AND longitude < " + (lon + 1) + "\n" 
                + "   AND longitude > " + (lon - 1);

        System.out.println(sql);
        
        obj = new JSONObject();  
        try {
            InitialContext initialContext = new InitialContext();
            Context context = (Context) initialContext.lookup("java:comp/env");
            //The JDBC Data source that we just created
            DataSource ds = (DataSource) context.lookup("twsa");
            Connection connection = ds.getConnection();

            if (connection == null) {
                throw new SQLException("Error establishing connection!");
            }

            try {
                Statement stmt = connection.createStatement();
                ResultSet rs = stmt.executeQuery(sql);
                if (rs.next()) {
                    obj.put("latitude", rs.getDouble(1));
                    obj.put("longitude", rs.getDouble(2));
                    obj.put("time", rs.getDate(3));
                    obj.put("key", target);
                    obj.put("value", rs.getDouble(4));
                    obj.put("water_shed_id", rs.getObject(5));
                    obj.put("water_shed_name", rs.getString(6));
                }
            } finally {
                connection.close();
            }
        } catch (Exception ex) {
            System.out.println("ERROR: " + sql);
            ex.printStackTrace();
        }

        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        out.print(obj.toString());

        out.flush();
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "get data at the specfied latitude and longitude";
    }// </editor-fold>

}
