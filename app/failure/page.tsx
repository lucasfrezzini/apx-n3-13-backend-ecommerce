export default function FailurePage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      backgroundColor: "#ef4444",
      color: "white"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Pago Rechazado</h1>
      <p style={{ fontSize: "1.5rem" }}>El pago no pudo ser procesado.</p>
      <a 
        href="/" 
        style={{ 
          marginTop: "2rem", 
          padding: "1rem 2rem", 
          backgroundColor: "white", 
          color: "#ef4444",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Intentar nuevamente
      </a>
    </div>
  );
}