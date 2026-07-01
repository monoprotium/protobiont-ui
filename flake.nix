{
  description = "Protobiont UI CLI (prt) — copy-source Vue component installer";

  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      lib = pkgs.lib;

      # baseline bun (older CPUs lack AVX2), patched to run in the sandbox
      bunBaseline = pkgs.stdenv.mkDerivation {
        pname = "bun-baseline";
        version = "1.3.14";
        src = pkgs.fetchurl {
          url = "https://github.com/oven-sh/bun/releases/download/bun-v1.3.14/bun-linux-x64-baseline.zip";
          hash = "sha256-oGOQiuCLeFLKEJObvcbO7T3avOj7lALc6D1l1zs25sc=";
        };
        nativeBuildInputs = [
          pkgs.unzip
          pkgs.autoPatchelfHook
        ];
        buildInputs = [ pkgs.stdenv.cc.cc.lib ];
        unpackPhase = "unzip $src";
        installPhase = "install -Dm755 bun-linux-x64-baseline/bun $out/bin/bun";
        dontStrip = true;
      };

      # offline deps (FOD); hash changes only when a dependency changes
      bunDeps = pkgs.stdenv.mkDerivation {
        name = "prt-bun-deps";
        src = lib.fileset.toSource {
          root = ./.;
          fileset = lib.fileset.unions [
            ./package.json
            ./bun.lock
            ./bunfig.toml
            ./cli/package.json
            ./demo/package.json
          ];
        };
        nativeBuildInputs = [ bunBaseline ];
        buildPhase = ''
          export HOME=$TMPDIR
          bun install --frozen-lockfile --no-progress
        '';
        installPhase = "cp -r node_modules $out";
        dontFixup = true;
        outputHashMode = "recursive";
        outputHashAlgo = "sha256";
        outputHash = "sha256-inhD5P0wRyIvolyp4UpnHF97Bpq4c8VV935FhCSJi2E=";
      };
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        pname = "prt";
        version = "0.0.1";
        src = ./.;
        nativeBuildInputs = [
          bunBaseline
          pkgs.makeWrapper
        ];
        dontConfigure = true;
        buildPhase = ''
          export HOME=$TMPDIR
          cp -r ${bunDeps} node_modules
          chmod -R u+w node_modules
          bun scripts/build-registry.ts
          bun build cli/src/index.ts --target=node --outfile=prt-bundle.js
        '';
        installPhase = ''
          mkdir -p $out/bin $out/lib/prt
          cp prt-bundle.js $out/lib/prt/index.js
          cp -r templates $out/lib/prt/templates
          makeWrapper ${pkgs.nodejs}/bin/node $out/bin/prt \
            --add-flags "$out/lib/prt/index.js" \
            --set PRT_ROOT "$out/lib/prt"
        '';
        dontFixup = true;
        meta = {
          description = "prt — Protobiont UI copy-source component CLI";
          mainProgram = "prt";
        };
      };
    };
}
