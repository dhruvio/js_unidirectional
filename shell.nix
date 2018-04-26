{ pkgs ? import <nixpkgs> {} }:

with pkgs;

stdenv.mkDerivation {
  name = "unidirectional";
  buildInputs = [
    nodejs-8_x
  ];
  shellHook = ''
    #set up prompt
    source ~/.bashrc
    #install dependencies
    npm install
  '';
}
