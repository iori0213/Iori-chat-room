import { Dimensions } from "react-native";
//getting the window width and height
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

//Radius
export const cornerRadius = windowWidth * 0.23;
//Colors
export const bg_LightColor = "#45c1b9";
export const bg_DarkColor = "#171535";
export const font_color = "#AFF";
export const placeholderColor = "#477";
//Size
export const inputIconSize = windowWidth * 0.07;
export const bottomIconSize = windowWidth * 0.07;
export const inputFontSize = windowWidth * 0.04;