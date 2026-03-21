export default function SuccessPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      backgroundColor: "#10b981",
      color: "white"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Pago Aprobado</h1>
      <p style={{ fontSize: "1.5rem" }}>Tu pago fue procesado correctamente.</p>
      <a 
        href="/" 
        style={{ 
          marginTop: "2rem", 
          padding: "1rem 2rem", 
          backgroundColor: "white", 
          color: "#10b981",
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