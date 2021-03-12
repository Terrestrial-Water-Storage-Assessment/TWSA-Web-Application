package edu.sdsc.twsa;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Date;
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
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author kailin
 */
public class GridQueryServlet extends HttpServlet {

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
        Double lon = (Double) obj.getJSONArray("lonlat").get(0);
        Double lat = (Double) obj.getJSONArray("lonlat").get(1);

        String sql
                = "SELECT latitude, longitude, day, cmwe, evaporation, precipitation, runoff \n"
                + "  FROM water_data \n"
                + " WHERE ST_GeomFromText('POINT(" + lon + " " + lat + ")', 4326) = gps \n"
                + " ORDER BY day";

        System.out.println(sql);

        JSONArray result = new JSONArray();

        JSONObject cmweSerie = new JSONObject();
        JSONObject precipitationSerie = new JSONObject();
        JSONObject evaporationSerie = new JSONObject();
        JSONObject runoffSerie = new JSONObject();

        JSONArray cmwe = new JSONArray();
        JSONArray precipitation = new JSONArray();
        JSONArray evaporation = new JSONArray();
        JSONArray runoff = new JSONArray();

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
                while (rs.next()) {
                    Date date = rs.getDate("day");

                    JSONObject cmweValue = new JSONObject();
                    cmweValue.put("x", date.getTime());
                    cmweValue.put("y", rs.getDouble("cmwe"));
                    cmwe.put(cmweValue);

                    JSONObject precipitationValue = new JSONObject();
                    precipitationValue.put("x", date.getTime());
                    precipitationValue.put("y", rs.getDouble("precipitation"));
                    precipitation.put(precipitationValue);

                    JSONObject evaporationValue = new JSONObject();
                    evaporationValue.put("x", date.getTime());
                    evaporationValue.put("y", rs.getDouble("evaporation"));
                    evaporation.put(evaporationValue);

                    JSONObject runoffValue = new JSONObject();
                    runoffValue.put("x", date.getTime());
                    runoffValue.put("y", rs.getDouble("runoff"));
                    runoff.put(runoffValue);
                }
            } finally {
                connection.close();
            }
        } catch (Exception ex) {
            System.out.println("ERROR: " + sql);
            ex.printStackTrace();
        }

        cmweSerie.put("data", cmwe);
        cmweSerie.put("name", "cmwe");
        result.put(cmweSerie);

        precipitationSerie.put("data", precipitation);
        precipitationSerie.put("name", "precipitation");
        result.put(precipitationSerie);

        evaporationSerie.put("data", evaporation);
        evaporationSerie.put("name", "evaporation");
        result.put(evaporationSerie);

        runoffSerie.put("data", runoff);
        runoffSerie.put("name", "runoff");
        result.put(runoffSerie);

        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        out.print(result.toString());

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
