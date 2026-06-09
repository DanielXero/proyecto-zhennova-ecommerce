import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerfil, updatePerfil, clearError } from '../store/usersSlice';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.users);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchPerfil());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.Direccions && user.Direccions.length > 0) {
      const direccion = user.Direccions[0];
      reset({
        nombre: user.nombre,
        apellido: user.apellido,
        nro_telefono: user.nro_telefono,
        calle: direccion.calle,
        nro_calle: direccion.nro_calle,
        piso: direccion.piso || '',
        cod_postal: direccion.cod_postal,
        id_localidad: direccion.id_localidad
      });
    } else if (user) {
      reset({
        nombre: user.nombre,
        apellido: user.apellido,
        nro_telefono: user.nro_telefono,
        calle: '',
        nro_calle: '',
        piso: '',
        cod_postal: '',
        id_localidad: ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(updatePerfil(data));
    if (updatePerfil.fulfilled.match(result)) {
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
      dispatch(fetchPerfil());
    } else {
      toast.error(error || 'Error al actualizar');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-cyan"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-dark text-white border-secondary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white mb-0">👤 Mi Perfil</h2>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancelar' : 'Editar perfil'}
                </button>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Datos personales */}
                <h5 className="text-cyan">Datos personales</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary">Nombre</label>
                    <input
                      type="text"
                      className={`form-control bg-dark text-white ${errors.nombre ? 'border-danger' : 'border-secondary'}`}
                      {...register('nombre', { required: 'El nombre es obligatorio' })}
                      disabled={!isEditing}
                    />
                    {errors.nombre && <span className="text-danger small">{errors.nombre.message}</span>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-secondary">Apellido</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      {...register('apellido')}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control bg-dark text-white border-secondary"
                    {...register('nro_telefono')}
                    disabled={!isEditing}
                  />
                </div>

                {/* Dirección */}
                <h5 className="text-cyan mt-4">Dirección de envío</h5>
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label className="form-label text-secondary">Calle</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      {...register('calle', { required: isEditing ? 'La calle es obligatoria' : false })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary">Número</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      {...register('nro_calle', { required: isEditing ? 'El número es obligatorio' : false })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label text-secondary">Piso</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      {...register('piso')}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary">Código postal</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      {...register('cod_postal', { required: isEditing ? 'El código postal es obligatorio' : false })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-secondary">Localidad (ID)</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      {...register('id_localidad', { required: isEditing ? 'La localidad es obligatoria' : false })}
                      disabled={!isEditing}
                    />
                    <small className="text-secondary">ID de localidad (ej: 1 para CABA)</small>
                  </div>
                </div>

                {isEditing && (
                  <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;