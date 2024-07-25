// const handleFormSubmit = async (data: PersonalDataFormType) => {
//   try {
//     const address = data.address.zipCode;
//     try {
//       const response = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: {
//             q: address,
//             format: "json",
//             addressdetails: 1,
//           },
//         }
//       );
//       if (response.data.length < 1) {
//         setCoordinates(null);
//         console.warn(
//           "Nenhuma coordenada encontrada para o endereço fornecido"
//         );
//       }

//       if (response.data.length > 0) {
//         const { lat, lon } = response.data[0];
//         const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
//         setCoordinates(coords);
//         if (coords[0] === 0 && coords[1] === 0) {
//           console.warn("Coordenadas inválidas recebidas: [0, 0]");
//         } else {
//           setCoordinates(coords);
//           const newCompany = {
//             ...data,
//             coordinates: coords,
//           };
//           const storedCompanies = JSON.parse(
//             localStorage.getItem("empresas") || "[]"
//           );
//           storedCompanies.push(newCompany);
//           localStorage.setItem("empresas", JSON.stringify(storedCompanies));
//         }
//       } else {
//         setCoordinates(null);
//         console.warn(
//           "Nenhuma coordenada encontrada para o endereço fornecido"
//         );
//       }
//     } catch (error) {
//       console.error("Erro ao processar o formulário:", error);
//     }
//   } catch (error) {
//     console.error("Erro ao processar o formulário:", error);
//   }
// };