import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, ContactShadows, TorusKnot } from '@react-three/drei';

function MinimalistKnot({ color }) {
  const knotRef = useRef();

  useFrame((state, delta) => {
    // Son derece yavaş, pürüzsüz ve zarif bir dönüş (Zen felsefesi)
    knotRef.current.rotation.x += delta * 0.1;
    knotRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Kusursuz geometriye sahip Infinity Knot (Sonsuzluk Düğümü) */}
        <TorusKnot ref={knotRef} args={[1.2, 0.35, 256, 64]}>
          <MeshTransmissionMaterial 
            backside 
            samples={4}
            thickness={1} 
            roughness={0.15} // Buzlu cam (Frosted glass) hissiyatı
            clearcoat={1} // Üzerindeki pürüzsüz cila yansıması
            clearcoatRoughness={0.1}
            transmission={1} 
            ior={1.4} // Işık kırılma endeksi
            color={color}
          />
        </TorusKnot>
      </Float>

      {/* Çok yumuşak, estetik bir zemin gölgesi */}
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={8} blur={3} far={4} color="#000000" />
    </group>
  );
}

export default function ThreeDWidget({ settings }) {
  // Minimalist, göz yormayan, zarif bir açık mavi/beyaz varsayılan renk
  const primaryColor = settings.primaryColor || '#e0f7fa';

  return (
    <div className="relative w-64 h-64 pointer-events-none group-hover:pointer-events-auto transition-all duration-500">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
        
        {/* Temiz stüdyo aydınlatması (Pürüzsüz yansımalar için) */}
        <Environment preset="studio" />

        <MinimalistKnot color={primaryColor} />
      </Canvas>
    </div>
  );
}
