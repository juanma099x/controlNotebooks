import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
          <p className="text-gray-500">
            Bienvenido de nuevo, por favor ingrese sus credenciales
          </p>
        </div>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Tu nombre de usuario"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              required
            />
          </div>
          <Button className="w-full" type="submit">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}