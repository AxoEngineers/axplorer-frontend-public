/* returns Axos in the following JSON format:
{
  "axoHolder": {
    "axosHeld": [
      {
        "id": "0"
      },
      ...
    ],
    "axosStakedV1": [
      {
        "id": "64"
      },
      ...
    ],
    "axosStakedV2": [
      {
        "id": "8663"
      },
      ...
    ],
    "axosStakedV2Test": [],
    "arbiAxosHeld": [
      {
        "id": "1502"
      },
      ...
    ]
  }
}
*/
async function getAxoData(walletAddress)
{
    let axoData = await fetch(`https://axo-backend-pvj2l.ondigitalocean.app/axos_raw?address=${walletAddress}`);
    if (!axoData.ok) {
        console.log('There was an error contacting the external service.');
    }
    return await axoData.json();
}

export default getAxoData;