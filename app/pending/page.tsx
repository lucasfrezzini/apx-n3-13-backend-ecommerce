export default function PendingPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      backgroundColor: "#f59e0b",
      color: "white"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Pago Pendiente</h1>
      <p style={{ fontSize: "1.5rem" }}>El pago está siendo procesado.</p>
      <a 
        href="/" 
        style={{ 
          marginTop: "2rem", 
          padding: "1rem 2rem", 
          backgroundColor: "white", 
          color: "#f59e0b",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Volver al inicio
      </a>
    </div>
  );
}