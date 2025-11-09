#!/usr/bin/env python3
"""
Debug CLSAG signature issue
"""

print("=" * 60)
print("DEBUGGING CLSAG SIGNATURE ISSUE")
print("=" * 60)

try:
    import pp_clsag_core
    
    print("\n1. Testing basic CLSAG operations:")
    
    # Generate keys
    seed1 = pp_clsag_core.generate_seed()
    sk1, pk1 = pp_clsag_core.derive_keypair(seed1)
    
    seed2 = pp_clsag_core.generate_seed()
    sk2, pk2 = pp_clsag_core.derive_keypair(seed2)
    
    print(f"   Generated keys:")
    print(f"   - sk1 type: {type(sk1)}, length: {len(sk1)}")
    print(f"   - pk1 type: {type(pk1)}, length: {len(pk1)}")
    
    # Convert to bytes if needed
    if isinstance(pk1, list):
        pk1_bytes = bytes(pk1)
        pk2_bytes = bytes(pk2)
        sk1_bytes = bytes(sk1)
        print("   Converted lists to bytes")
    else:
        pk1_bytes = pk1
        pk2_bytes = pk2
        sk1_bytes = sk1
        print("   Already bytes objects")
    
    print(f"   - pk1_bytes: {pk1_bytes.hex()[:32]}...")
    print(f"   - pk2_bytes: {pk2_bytes.hex()[:32]}...")
    
    # Create ring
    ring = [pk1_bytes, pk2_bytes]
    message = b"test message"
    signer_index = 0
    
    print(f"\n2. Creating CLSAG signature:")
    print(f"   - Message: {message}")
    print(f"   - Ring size: {len(ring)}")
    print(f"   - Signer index: {signer_index}")
    
    try:
        signature = pp_clsag_core.clsag_sign(message, ring, sk1_bytes, signer_index)
        print(f"   ✅ Signature created successfully")
        print(f"   - Signature type: {type(signature)}")
        
        # Check signature structure
        if hasattr(signature, 'key_image'):
            if isinstance(signature.key_image, list):
                key_image_hex = bytes(signature.key_image).hex()
            else:
                key_image_hex = signature.key_image.hex()
            print(f"   - Key image: {key_image_hex[:32]}...")
        else:
            print(f"   - Signature content: {str(signature)[:100]}...")
        
        print(f"\n3. Verifying CLSAG signature:")
        
        # Try verification
        is_valid = pp_clsag_core.clsag_verify(message, ring, signature)
        print(f"   - Verification result: {is_valid}")
        
        if not is_valid:
            print("   ❌ Signature verification failed!")
            
            # Try with different parameters
            print("\n4. Debugging verification:")
            
            # Check if it's a parameter issue
            try:
                # Try with original message
                is_valid2 = pp_clsag_core.clsag_verify(message, ring, signature)
                print(f"   - Same params again: {is_valid2}")
                
                # Try with wrong message
                wrong_message = b"wrong message"
                is_valid3 = pp_clsag_core.clsag_verify(wrong_message, ring, signature)
                print(f"   - Wrong message: {is_valid3}")
                
                # Try with wrong ring
                wrong_ring = [pk2_bytes, pk1_bytes]  # Swapped order
                is_valid4 = pp_clsag_core.clsag_verify(message, wrong_ring, signature)
                print(f"   - Wrong ring order: {is_valid4}")
                
            except Exception as e:
                print(f"   - Debug verification error: {e}")
        else:
            print("   ✅ Signature verification successful!")
            
    except Exception as e:
        print(f"   ❌ CLSAG signing failed: {e}")
        import traceback
        traceback.print_exc()
    
    # Test if there are alternative functions
    print(f"\n5. Available pp_clsag_core functions:")
    for attr in dir(pp_clsag_core):
        if not attr.startswith('_'):
            print(f"   - {attr}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
