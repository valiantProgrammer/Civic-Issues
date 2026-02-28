import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  const restApiKey = process.env.NEXT_PUBLIC_MAPMYINDIA_REST_KEY;
  if (!restApiKey) {
    console.error("SERVER ERROR: Mappls REST API Key is missing in .env.local.");
    return NextResponse.json(
      { error: 'API configuration error on server' },
      { status: 500 }
    );
  }

  const url = `https://apis.mappls.com/advancedmaps/v1/${restApiKey}/rev_geocode?lat=${lat}&lng=${lng}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Mappls API responded with status: ${response.status}`);
      try {
        const errorData = await response.json();
        console.error("Mappls API Error Response:", errorData);
      } catch (e) {
        console.error("Could not parse Mappls error response.");
      }
      throw new Error(`Mappls API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // --- REFACTORED LOGIC: Create a clean response object ---
    if (data.results && data.results.length > 0) {
        const address = data.results[0];
        let propertyType = 'Public Area'; // Default type

        // Infer property type based on available data
        if (address.poi) {
            propertyType = 'Public/Commercial';
        } else if (address.houseName || address.houseNumber) {
            propertyType = 'Private Residence';
        }
        
        // Construct a new, simplified payload for the frontend
        const responsePayload = {
            house: address.houseName || address.poi || 'N/A',
            street: address.street || 'N/A',
            locality: address.subLocality || address.locality || 'N/A',
            propertyType: propertyType
        };

        return NextResponse.json(responsePayload);
    } else {
        // Handle cases where Mappls returns no results for the coordinates
        return NextResponse.json({
            house: '',
            street: '',
            locality: 'Address not found',
            propertyType: 'Unknown'
        });
    }

  } catch (error) {
    console.error('API route error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch geocode data from Mappls API' },
      { status: 502 } // 502 Bad Gateway is more appropriate here
    );
  }
}

