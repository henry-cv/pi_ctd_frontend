import Avatar from '@mui/material/Avatar';

const CustomAvatar = ({ alt, src, size = 40 }) => {
  return (
    <Avatar 
      alt={alt} 
      src={src}
      sx={{ 
        width: size, 
        height: size 
      }}
    />
  );
};

export default CustomAvatar;
