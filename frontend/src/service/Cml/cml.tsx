import type { ICml } from "../../interface/cml"

const API_URL = "http://localhost:8000" // เปลี่ยนตาม backend ของคุณ

export async function getcmlbyinfoID(id : number){
  try {
    const res = await fetch(`${API_URL}/cml/${id}`, {
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
    return null
  }
}

export async function getcmlbyID(id : number){
    try {
      const res = await fetch(`${API_URL}/cml/id/${id}`, {
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
      return null
    }
  }

export async function AddNewCml(data: ICml){
  try {
    const response = await fetch(`${API_URL}/cml`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error fetching info: ${response.status}`)
    }

    const responseData = await response.json()
 
    return responseData
  } catch (err) {
    console.error(err)
    return false
  
  }
}

export async function UpdateCmlByID(data: ICml , id: number){
    try {
      const response = await fetch(`${API_URL}/cml/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
  
      if (!response.ok) {
        throw new Error(`Error fetching info: ${response.status}`)
      }
  
      const responseData = await response.json()
   
      return responseData
    } catch (err) {
      console.error(err)
      return false
    
    }
  }

export async function DeleteCml(id: number){
  try {
    const res = await fetch(`${API_URL}/cml/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Error fetching info: ${res.status}`)
    }

    const data = await res.json()
    console.log("delete data:", data)
    return data
  } catch (err) {
    console.error(err)
    return false
  }
}