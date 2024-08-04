import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const UserMap = () => {
  const [data, setData] = useState({});
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/statistics/user-count-by-county');
        const result = await response.json();
        setData(result); 
      } catch (error) {
        console.error('Error fetching user count by county:', error);
      }
    };
    fetchData();
  }, []);

  const getColor = (count) => {
    if (count.Actor > count.Producator) {
      return '#FFA07A';
    } else if (count.Producator > count.Actor) {
      return '#20B2AA'; 
    } else {
      return 'white'; 
    }
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div style={{ position: 'relative', backgroundColor: '#FFCD5C', height: '900px' }}>
      <h2 className='titlu-harta'>Distribuirea actorilor și producătorilor per județe</h2>
      <div onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
        <ComposableMap
          data-tip=""
          projectionConfig={{ scale: 5000, center: [24.5, 45] }}
          style={{ width: '100%', height: 'auto' }}
          className='map-section'
        >
          <Geographies geography="/geojson/ro_judete_poligon.geojson">
            {({ geographies }) =>
              geographies.map((geo) => {
                const { name } = geo.properties;
                const count = data[name] || { Actor: 0, Producator: 0 };
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setTooltipContent(`${name} - Actori: ${count.Actor}, Producători: ${count.Producator}`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    style={{
                      default: {
                        fill: getColor(count),
                        stroke: "#000",
                        strokeWidth: 0.5, 
                        outline: 'none',
                      },
                      hover: {
                        fill: '#F53',
                        stroke: "#000", 
                        strokeWidth: 0.5, 
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#E42',
                        stroke: "#000", 
                        strokeWidth: 0.5, 
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {tooltipContent && (
          <div
            style={{
              position: 'absolute',
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x + 10,
              backgroundColor: 'white',
              padding: '5px',
              border: '1px solid black',
              borderRadius: '3px',
              pointerEvents: 'none',
              zIndex: 1000,
              transition: 'top 0.1s, left 0.1s' 
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMap;
