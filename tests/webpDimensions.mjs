// Read the dimensions actually encoded in a bundled WebP, independently of its manifest.
export function webpDimensions(bytes) {
 if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')throw Error('Expected WebP');
 for(let at=12;at+8<=bytes.length;){
  const kind=bytes.toString('ascii',at,at+4),length=bytes.readUInt32LE(at+4),data=at+8;
  if(kind==='VP8X')return [1+bytes.readUIntLE(data+4,3),1+bytes.readUIntLE(data+7,3)];
  if(kind==='VP8 ')return [bytes.readUInt16LE(data+6)&0x3fff,bytes.readUInt16LE(data+8)&0x3fff];
  if(kind==='VP8L'){const packed=bytes.readUInt32LE(data+1);return [1+(packed&0x3fff),1+((packed>>>14)&0x3fff)];}
  at=data+length+(length%2);
 }
 throw Error('No WebP image dimensions');
}
