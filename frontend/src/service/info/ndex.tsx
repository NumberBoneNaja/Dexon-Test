// api/infoApi.ts


const API_URL = "http://localhost:8080" // เปลี่ยนตาม backend ของคุณ

export async function getAllInfo(){
  try {
    const res = await fetch(`${API_URL}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Error fetching info: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
    return []
  }
}
