// Helper function to convert file buffer to base64
export const fileToBase64 = (buffer, mimetype) => {
    return `data:${mimetype};base64,${buffer.toString("base64")}`
  }
  
  // Helper function to extract CA items from form data
  export const extractCaItemsFromFormData = (req) => {
    const caItems = []
    const formKeys = Object.keys(req.body)
  
    let currentCaIndex = -1
    let currentCa = null
  
    formKeys.forEach((key) => {
      // Match keys like caItems[0][caName], caItems[0][value], etc.
      const match = key.match(/caItems\[(\d+)\]\[([^\]]+)\]/)
      if (match) {
        const index = Number.parseInt(match[1])
        const property = match[2]
  
        if (currentCaIndex !== index) {
          if (currentCa) {
            caItems.push(currentCa)
          }
          currentCaIndex = index
          currentCa = { images: [] }
        }
  
        currentCa[property] = req.body[key]
      }
    })
  
    // Add the last CA if exists
    if (currentCa) {
      caItems.push(currentCa)
    }
  
    return caItems
  }
  
  // Helper function to process uploaded files
  export const processUploadedFiles = (files, caItems) => {
    if (!files || files.length === 0) return caItems
  
    files.forEach((file) => {
      // Extract CA index and image index from field name
      const fieldMatch = file.fieldname.match(/caItems\[(\d+)\]\[images\]\[(\d+)\]/)
      if (fieldMatch) {
        const caIndex = Number.parseInt(fieldMatch[1])
  
        if (caItems[caIndex]) {
          // Convert file to base64
          const base64Image = fileToBase64(file.buffer, file.mimetype)
  
          // Add image to the CA item
          if (!caItems[caIndex].images) {
            caItems[caIndex].images = []
          }
  
          caItems[caIndex].images.push({
            data: base64Image,
            type: file.mimetype,
            size: file.size,
          })
        }
      }
    })
  
    return caItems
  }
  