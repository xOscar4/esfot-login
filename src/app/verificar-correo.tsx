import { useState } from 'react';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';

export default function PantallaVerificarCorreo() {
  const {
    usuario,
    reenviarCorreoVerificacion,
    actualizarVerificacionCorreo,
    cerrarSesion,
  } = useSesion();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'error' | 'exito'>('exito');
  const [procesando, setProcesando] = useState(false);

  async function manejarReenvio() {
    setProcesando(true);
    setMensaje(null);
    try {
      await reenviarCorreoVerificacion();
      setTipoMensaje('exito');
      setMensaje('Te enviamos otro enlace de verificación. Revisa también la carpeta de spam.');
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(mensajeDeError(error));
    } finally {
      setProcesando(false);
    }
  }

  async function manejarComprobacion() {
    setProcesando(true);
    setMensaje(null);
    try {
      const verificado = await actualizarVerificacionCorreo();
      if (!verificado) {
        setTipoMensaje('error');
        setMensaje('Todavía no aparece la verificación. Abre el enlace que enviamos y vuelve a intentarlo.');
      }
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(mensajeDeError(error));
    } finally {
      setProcesando(false);
    }
  }

  return (
    <PantallaHoja
      titulo={'Verifica tu\ncorreo'}
      bajada={`Enviamos un enlace de verificación a ${usuario?.email ?? 'tu correo'}. Verifica tu dirección para continuar.`}>
      {mensaje ? <Aviso tipo={tipoMensaje} mensaje={mensaje} /> : null}

      <Boton
        texto="Ya verifiqué mi correo"
        onPress={manejarComprobacion}
        cargando={procesando}
      />
      <Boton
        variante="secundario"
        texto="Reenviar enlace"
        onPress={manejarReenvio}
        deshabilitado={procesando}
      />
      <Boton
        variante="enlace"
        texto="Cerrar sesión"
        onPress={cerrarSesion}
        deshabilitado={procesando}
      />
    </PantallaHoja>
  );
}
