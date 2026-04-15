import pandas as pd
import json

file_path = "/home/adminetec/.openclaw/media/inbound/ISTQB_Completo_V1.2---231164ae-bad3-4eed-9e94-62453271c73e.xlsx"

try:
    # Cargar el excel
    df = pd.read_excel(file_path)
    
    # Obtener información básica
    info = {
        "filas_totales": len(df),
        "columnas": list(df.columns),
        "primeras_5_filas": df.head(5).to_dict(orient='records')
    }
    
    print(json.dumps(info, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error al leer el archivo: {str(e)}")
